# Research: GitHub Pages Deployment with CI/CD

**Feature**: 005-i-want-to  
**Date**: 2025-10-06  
**Status**: Complete

## Research Questions

### 1. Next.js Static Export Configuration

**Question**: How to configure Next.js 15.5.4 for GitHub Pages deployment with client-side routing preservation?

**Decision**: Use Next.js static export mode with custom 404.html fallback

**Rationale**:

- Next.js 15+ supports `output: 'export'` in `next.config.js` for pure static HTML generation
- GitHub Pages serves `404.html` for all non-existent paths, enabling client-side routing
- Base path configuration required for non-root GitHub Pages URLs (`/repo-name/`)
- Image optimization must use `unoptimized: true` (GitHub Pages doesn't support Next.js Image API)

**Implementation**:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/mcp-learning-platform' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Ensures /about/ works instead of /about
}
```

**Alternatives Considered**:

- **Vercel Hosting**: Requires paid plan for private repos; GitHub Pages is free
- **Netlify**: Similar to Vercel, additional service to manage
- **Custom Static Host**: More complex setup, GitHub Actions integration overhead

**References**:

- Next.js Static Export: <https://nextjs.org/docs/app/building-your-application/deploying/static-exports>
- GitHub Pages with SPA: <https://github.com/rafgraph/spa-github-pages>

---

### 2. GitHub Actions Workflow Design

**Question**: What is the most reliable GitHub Actions workflow for building and deploying to GitHub Pages?

**Decision**: Use official `actions/deploy-pages` with build artifact upload

**Rationale**:

- Official GitHub Actions provide best compatibility and maintenance
- Artifact-based deployment separates build from deploy (better for debugging)
- `actions/deploy-pages` v4+ supports concurrency control (prevents race conditions)
- Permissions model follows least-privilege (separate read/write scopes)

**Workflow Structure**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:static
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**Alternatives Considered**:

- **Peaceiris/actions-gh-pages**: Popular but requires PAT token management
- **JamesIves/github-pages-deploy-action**: Similar, requires force push to gh-pages branch
- **Direct git push**: Complex, error-prone, doesn't support concurrency control

**References**:

- GitHub Pages Actions: <https://github.com/actions/deploy-pages>
- Workflow Permissions: <https://docs.github.com/en/actions/security-guides/automatic-token-authentication>

---

### 3. Client-Side Routing Fallback Strategy

**Question**: How to handle direct URL access and page refreshes with client-side routing on GitHub Pages?

**Decision**: Use 404.html fallback with path restoration script

**Rationale**:

- GitHub Pages serves 404.html for all non-existent paths
- Copy `out/404/index.html` to `out/404.html` during build
- 404.html executes client-side script to restore correct path
- Next.js router then takes over and renders the correct page

**Implementation**:

```javascript
// Build script adds this step after `next build && next export`
const fs = require('fs');
const path = require('path');

// Copy 404 page for GitHub Pages SPA routing
const notFoundSource = path.join(__dirname, 'out', '404', 'index.html');
const notFoundDest = path.join(__dirname, 'out', '404.html');
fs.copyFileSync(notFoundSource, notFoundDest);
```

**Alternatives Considered**:

- **Hash-based routing**: Works but creates ugly URLs (`/#/about`)
- **Server-side redirects**: Not available on GitHub Pages
- **Sub-path catch-all**: Requires complex rewrite rules

**References**:

- SPA GitHub Pages Pattern: <https://github.com/rafgraph/spa-github-pages>
- Next.js 404 Pages: <https://nextjs.org/docs/app/api-reference/file-conventions/not-found>

---

### 4. Build Performance Optimization

**Question**: How to minimize build time for faster deployments?

**Decision**: Use npm caching, incremental builds not available for static export

**Rationale**:

- GitHub Actions `actions/setup-node@v4` supports npm cache out-of-box
- Next.js static export doesn't support incremental builds (full rebuild required)
- Cache `node_modules` to save ~2 minutes per build
- Optimize Lighthouse CI to run only on PRs, not on main deploys

**Build Time Breakdown** (estimated):

```
- Checkout code: ~10s
- Setup Node + restore cache: ~30s (cached) / ~2m30s (cold)
- npm ci: ~30s (cached) / ~1m30s (cold)  
- npm run build:static: ~2-3 minutes
- Upload artifact: ~20s
- Deploy to GitHub Pages: ~30s
---
Total: ~4-5 minutes (cached), ~7-8 minutes (cold)
```

**Alternatives Considered**:

- **Next.js ISR on Vercel**: Faster builds but requires paid hosting
- **Build cache persistence**: GitHub Actions cache limited to 10GB, not worth complexity
- **Parallel builds**: Not applicable for single static export

**References**:

- Actions Caching: <https://github.com/actions/cache>
- Next.js Build Performance: <https://nextjs.org/docs/app/building-your-application/optimizing>

---

### 5. GitHub Pages Configuration Requirements

**Question**: What repository settings and permissions are required for GitHub Pages deployment?

**Decision**: Enable GitHub Pages with GitHub Actions source, configure branch protection

**Rationale**:

- GitHub Pages must be enabled in repository settings
- Source set to "GitHub Actions" (not legacy gh-pages branch)
- Requires `pages: write` and `id-token: write` permissions in workflow
- Branch protection on main prevents accidental broken deployments

**Required Settings**:

1. **Repository Settings** → **Pages**:
   - Source: GitHub Actions (not "Deploy from a branch")
   - Custom domain: Leave empty (using default `username.github.io/repo`)

2. **Actions Permissions**:
   - Allow all actions (default)
   - Ensure "Allow GitHub Actions to create and approve pull requests" is disabled (not needed)

3. **Branch Protection** (recommended):
   - Require status checks before merging
   - Include "build" job as required check
   - Prevents merging broken builds

**Alternatives Considered**:

- **Legacy gh-pages branch**: Deprecated, less flexible, requires force pushes
- **Custom domain**: Out of scope (noted in spec)

**References**:

- Configuring GitHub Pages: <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>
- GitHub Actions Permissions: <https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect>

---

### 6. Dependency and Security Scanning

**Question**: How to ensure deployment workflow doesn't introduce security vulnerabilities?

**Decision**: Use Dependabot for GitHub Actions dependencies, pin action versions to SHA

**Rationale**:

- GitHub Actions should be pinned to specific SHA for security (not just `@v4`)
- Dependabot automatically creates PRs for action updates
- Secrets managed via GitHub encrypted secrets (never in code)
- No new npm dependencies required for deployment

**Security Practices**:

```yaml
# Bad: Floating tag
- uses: actions/checkout@v4

# Good: Pinned SHA with comment
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

**Monitoring**:

- Enable Dependabot for GitHub Actions
- Review action updates monthly
- Audit workflow permissions quarterly

**Alternatives Considered**:

- **Self-hosted runners**: More secure but adds infrastructure complexity
- **Third-party security scanning**: Adds latency, GitHub's built-in sufficient

**References**:

- Pinning Actions: <https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions>
- Dependabot for Actions: <https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot>

---

## Technology Best Practices

### Next.js Static Export

**Best Practices**:

1. ✅ Use `output: 'export'` in next.config.js
2. ✅ Set `basePath` for GitHub Pages sub-path
3. ✅ Enable `trailingSlash: true` for consistent URLs
4. ✅ Set `images.unoptimized: true` (GitHub Pages doesn't support Image API)
5. ✅ Test locally with `next build && npx serve out`
6. ⚠️ Avoid `getServerSideProps` (not supported in static export)
7. ⚠️ Avoid `revalidate` in `getStaticProps` (ISR not supported)
8. ⚠️ Avoid API routes (serverless functions not supported on GitHub Pages)

**Current Application Compatibility**:

- ✅ All pages use client-side data fetching (sessionStorage)
- ✅ No server-side rendering (pure client-side)
- ✅ No API routes (all logic client-side)
- ✅ Images from `public/` folder (no external optimization needed)

### GitHub Actions

**Best Practices**:

1. ✅ Use concurrency control to prevent race conditions
2. ✅ Separate build and deploy jobs for better debugging
3. ✅ Use artifact upload/download for build outputs
4. ✅ Cache dependencies (npm, Next.js cache)
5. ✅ Pin action versions to SHA (security)
6. ✅ Use least-privilege permissions model
7. ✅ Add workflow_dispatch for manual triggers
8. ✅ Include environment URLs for easy access

### GitHub Pages

**Best Practices**:

1. ✅ Use HTTPS (enforced by GitHub Pages)
2. ✅ Set proper `Cache-Control` headers (handled by GitHub Pages CDN)
3. ✅ Include robots.txt (already in public/)
4. ✅ Use 404.html fallback for SPA routing
5. ✅ Test with `basePath` locally before deploying
6. ⚠️ Monitor build size (1GB soft limit)
7. ⚠️ Consider CDN costs (GitHub Pages is free but has usage limits)

---

## Integration Patterns

### Build → Deploy Pipeline

```
┌──────────────┐
│  Push to     │
│  main branch │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  GitHub Actions      │
│  Workflow Triggered  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Build Job           │
│  - Checkout code     │
│  - Setup Node 20     │
│  - Install deps      │
│  - Run build:static  │
│  - Upload artifact   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Deploy Job          │
│  - Download artifact │
│  - Deploy to Pages   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  GitHub Pages CDN    │
│  (Live Site)         │
└──────────────────────┘
```

### Routing Fallback Flow

```
User visits: https://user.github.io/repo/about

GitHub Pages checks:
1. /repo/about.html ❌ (doesn't exist)
2. /repo/about/index.html ❌ (doesn't exist)
3. Serves /repo/404.html ✓

404.html script:
1. Detects path: /about
2. Redirects to: /repo/ (or /)
3. Appends path to URL hash: /repo/#/about

Next.js router:
1. Detects hash path: #/about
2. Client-side navigation to /about
3. Renders About page
```

---

## Decision Summary

| Decision Point | Choice | Justification |
|----------------|--------|---------------|
| Static Export Mode | `output: 'export'` | GitHub Pages requires static files |
| Routing Strategy | 404.html fallback | Preserves client-side routing on GitHub Pages |
| Deployment Tool | `actions/deploy-pages` | Official, maintained, secure |
| Build Optimization | npm caching | Reduces build time by ~2 minutes |
| Security | Pin actions to SHA | Prevents supply chain attacks |
| Base Path | `/mcp-learning-platform` | Required for GitHub Pages non-root hosting |

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Build failures block deployment | High | Low | Pre-merge CI checks, branch protection |
| Large bundle exceeds 1GB limit | Medium | Very Low | Monitor build size, optimize assets |
| GitHub Pages downtime | High | Very Low | Accept risk (99.9% uptime SLA) |
| Breaking Next.js config change | Medium | Low | Test locally before merge |
| Action dependency vulnerability | Medium | Low | Dependabot auto-updates, SHA pinning |

---

## Open Questions Resolved

1. **Q**: Does Next.js 15+ support static export?  
   **A**: ✅ Yes, via `output: 'export'` in next.config.js

2. **Q**: Can GitHub Pages handle client-side routing?  
   **A**: ✅ Yes, with 404.html fallback pattern

3. **Q**: What's the expected build time?  
   **A**: ~4-5 minutes (cached), ~7-8 minutes (cold start)

4. **Q**: Are there GitHub Pages size limits?  
   **A**: ✅ 1GB soft limit (current app ~5-10MB, well under)

5. **Q**: Can we rollback deployments?  
   **A**: ✅ Yes, via git revert + workflow rerun (~8-10 min total)

---

**Status**: ✅ All research complete, no blockers identified  
**Next Phase**: Phase 1 - Design & Contracts
