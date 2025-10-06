# Data Model: GitHub Pages Deployment

**Feature**: 005-i-want-to  
**Date**: 2025-10-06  
**Status**: Complete

## Overview

This feature is **infrastructure-only** and does not introduce new runtime data models or database schemas. The "data" here refers to configuration artifacts, build metadata, and deployment state tracked by external systems (GitHub Actions, GitHub Pages).

## Configuration Data

### 1. Next.js Build Configuration

**Entity**: `next.config.js` modifications

**Purpose**: Configure Next.js for static export compatible with GitHub Pages

**Schema** (JavaScript configuration object):

```typescript
interface NextConfig {
  output: 'export'                    // Static export mode
  basePath: string                    // '/mcp-learning-platform' in production
  images: {
    unoptimized: boolean              // true (GitHub Pages doesn't support Image API)
  }
  trailingSlash: boolean              // true (ensures /about/ works)
  assetPrefix?: string                // Optional CDN prefix
}
```

**Validation Rules**:

- `output` must be exactly `'export'` for GitHub Pages
- `basePath` must match repository name (case-sensitive)
- `images.unoptimized` must be `true` (no optimization service on GitHub Pages)

**State Transitions**: N/A (static configuration)

**Example**:

```javascript
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/mcp-learning-platform' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
```

---

### 2. GitHub Actions Workflow Definition

**Entity**: `.github/workflows/deploy.yml`

**Purpose**: Define CI/CD pipeline for automated deployment

**Schema** (YAML workflow configuration):

```yaml
name: string                          # Workflow display name
on:                                   # Trigger conditions
  push:
    branches: [string]                # e.g., [main]
  workflow_dispatch: {}               # Manual trigger

permissions:                          # Security model
  contents: read
  pages: write
  id-token: write

concurrency:                          # Prevent race conditions
  group: string                       # e.g., "pages"
  cancel-in-progress: boolean

jobs:
  build:                              # Build job
    runs-on: string                   # e.g., ubuntu-latest
    steps: [...]                      # Build steps
  deploy:                             # Deploy job
    needs: [string]                   # Depends on build
    environment:
      name: string                    # e.g., github-pages
      url: string                     # Deployment URL
    steps: [...]                      # Deployment steps
```

**Validation Rules**:

- Must have `pages: write` and `id-token: write` permissions
- Build job must upload artifact named 'github-pages'
- Deploy job must depend on build job (`needs: build`)
- Concurrency group should be unique to prevent conflicts

**State Transitions**:

1. **Idle** → (push to main) → **Queued**
2. **Queued** → (runner available) → **Building**
3. **Building** → (build success) → **Deploying**
4. **Deploying** → (deployment success) → **Deployed**
5. **Building** → (build failure) → **Failed**

---

### 3. Build Artifact Metadata

**Entity**: Build provenance data (logged by GitHub Actions)

**Purpose**: Track build inputs/outputs for debugging and rollback

**Schema** (JSON logged to GitHub Actions):

```typescript
interface BuildMetadata {
  commit: {
    sha: string                       // Git commit SHA (40 chars)
    message: string                   // Commit message
    author: string                    // Commit author
    timestamp: string                 // ISO 8601 timestamp
  }
  build: {
    startTime: string                 // ISO 8601 build start
    endTime: string                   // ISO 8601 build end
    duration: number                  // Milliseconds
    nextVersion: string               // Next.js version
    nodeVersion: string               // Node.js version
    platform: string                  // e.g., ubuntu-latest
  }
  artifacts: {
    totalSize: number                 // Bytes
    fileCount: number                 // Number of files in out/
    hashSHA256: string                // Artifact checksum
  }
  deployment: {
    url: string                       // GitHub Pages URL
    status: 'success' | 'failed'      // Deployment outcome
  }
}
```

**Validation Rules**:

- `commit.sha` must be 40-character hexadecimal
- `build.duration` > 0 (sanity check)
- `artifacts.totalSize` < 1GB (GitHub Pages limit)

**State**: Immutable (written once per build, retained in GitHub Actions logs)

---

## External System Data

### 4. GitHub Pages Deployment State

**Entity**: GitHub Pages service state (managed by GitHub)

**Purpose**: Track currently deployed version

**Schema** (GitHub API response):

```typescript
interface GitHubPagesState {
  status: 'built' | 'building' | 'errored'
  url: string                         // e.g., https://user.github.io/repo
  source: {
    type: 'actions'                   // Deployment source
    branch: null                      // N/A for Actions source
  }
  lastDeployment: {
    commitSha: string                 // Currently deployed commit
    createdAt: string                 // ISO 8601 timestamp
    updatedAt: string                 // ISO 8601 timestamp
  }
}
```

**Access**: Read-only via GitHub API (agent cannot modify directly)

**Queries**:

- Get current deployment status: `GET /repos/{owner}/{repo}/pages`
- Get deployment history: `GET /repos/{owner}/{repo}/pages/deployments`

---

### 5. Package.json Scripts

**Entity**: npm script definitions

**Purpose**: Define build commands

**Schema** (package.json partial):

```json
{
  "scripts": {
    "dev": "next dev",                // Existing: local development
    "build": "next build",            // Existing: full build
    "build:static": "next build && node scripts/prepare-static.js", // NEW
    "start": "next start",            // Existing: production server (unused)
    "lint": "next lint",              // Existing: linting
    "test": "jest"                    // Existing: testing
  }
}
```

**New Script**: `build:static`

- Runs `next build` (compiles with `output: 'export'`)
- Runs `scripts/prepare-static.js` (copies 404/index.html to 404.html)

**Validation**: Script must be idempotent (safe to run multiple times)

---

## Data Flow Diagram

```
┌─────────────────┐
│   Developer     │
│   git push main │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   GitHub Actions Workflow       │
│   (deploy.yml)                  │
│                                 │
│   Inputs:                       │
│   - Commit SHA                  │
│   - Repository code             │
│                                 │
│   Outputs:                      │
│   - Build artifact (out/ dir)   │
│   - Build metadata (logs)       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   GitHub Pages Service          │
│                                 │
│   Inputs:                       │
│   - Build artifact              │
│                                 │
│   State:                        │
│   - Current deployment          │
│   - Deployment history          │
│                                 │
│   Outputs:                      │
│   - Public website (CDN)        │
└─────────────────────────────────┘
```

---

## Entity Relationships

```
NextConfig (next.config.js)
    ↓ configures
Build Process (GitHub Actions build job)
    ↓ produces
Build Artifact (out/ directory)
    ↓ uploaded to
GitHub Actions Artifact Storage
    ↓ downloaded by
Deploy Process (GitHub Actions deploy job)
    ↓ publishes to
GitHub Pages Service
    ↓ serves
Public Website (https://user.github.io/repo)
```

---

## Validation Rules Summary

| Entity | Key Validation | Failure Handling |
|--------|----------------|------------------|
| `next.config.js` | `output: 'export'` must be set | Build fails with config error |
| Workflow YAML | Valid syntax, required permissions | Workflow fails to start |
| Build Artifact | < 1GB total size | Build fails, alert in logs |
| Deployment | HTTP 200 response from Pages URL | Deploy job fails, rollback possible |

---

## State Management

**During Build**:

1. Workflow triggered → State: `queued`
2. Build starts → State: `building`
3. Artifact uploaded → State: `build_complete`
4. Deploy starts → State: `deploying`
5. Deployment succeeds → State: `deployed`

**During Failure**:

- Build failure → State: `build_failed` (no deployment attempted)
- Deploy failure → State: `deploy_failed` (previous deployment still live)

**Rollback**:

1. Developer runs: `git revert <commit-sha>`
2. Push reverted commit to main
3. Workflow re-runs with previous code
4. Deploys previous version (~8-10 min total)

---

## No Database Changes

This feature does **NOT** require:

- ❌ New database tables
- ❌ Schema migrations
- ❌ Data seeding
- ❌ ORM configuration changes

**Rationale**: Deployment infrastructure is external to the application's runtime data model.

---

## Configuration Files Summary

| File | Purpose | Format | Validation |
|------|---------|--------|------------|
| `next.config.js` | Next.js build config | JavaScript object | Type-checked by Next.js |
| `.github/workflows/deploy.yml` | CI/CD pipeline | YAML | GitHub Actions schema |
| `package.json` | Build scripts | JSON | npm validates |
| `scripts/prepare-static.js` | Post-build processing | JavaScript | Node.js syntax |

---

**Status**: ✅ Data model complete (configuration-only, no runtime data)  
**Next**: Phase 1 - Generate quickstart.md
