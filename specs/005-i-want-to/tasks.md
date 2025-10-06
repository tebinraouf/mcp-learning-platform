# Tasks: GitHub Pages Deployment with CI/CD

**Input**: Design documents from `/specs/005-i-want-to/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Execution Flow (main)

```
1. Load plan.md from feature directory
   ✓ Loaded - Next.js static export, GitHub Actions, GitHub Pages
   ✓ Tech stack: TypeScript 5.7, Next.js 15.5.4, Node.js 20+ LTS
   ✓ Structure: Single project (existing Next.js app at repository root)
2. Load optional design documents:
   ✓ data-model.md: 5 configuration entities (NextConfig, Workflow YAML, scripts, build metadata)
   ✓ research.md: 6 technical decisions (static export, workflow design, routing fallback)
   ✓ quickstart.md: 5 validation scenarios
3. Generate tasks by category:
   ✓ Setup: next.config.js, package.json, scripts
   ✓ Infrastructure: GitHub Actions workflow, gitignore
   ✓ Tests: Build validation, routing validation, workflow syntax
   ✓ Documentation: README updates
   ✓ Validation: Manual deployment scenarios
4. Apply task rules:
   ✓ Config files = mark [P] for parallel (next.config.js, package.json, scripts)
   ✓ Workflow = sequential (depends on config)
   ✓ Tests = parallel [P] (independent validation scripts)
5. Number tasks sequentially (T001-T018)
6. Generate dependency graph (Waves 1-5)
7. Create parallel execution examples
8. Validate task completeness:
   ✓ All config entities have implementation tasks
   ✓ All quickstart scenarios have validation tasks
   ✓ Infrastructure before tests before validation
9. Return: SUCCESS (18 tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

**Single Next.js project at repository root**:

- Configuration: `next.config.js`, `package.json` (repository root)
- Infrastructure: `.github/workflows/deploy.yml`
- Scripts: `scripts/prepare-static.js`
- Build output: `out/` (generated, gitignored)

## Wave 1: Configuration Files (Parallel Execution)

- [x] **T001** [P] Create next.config.js modifications for GitHub Pages static export
  - **Type**: Configuration
  - **Dependencies**: None
  - **Files**: `next.config.js` (modify existing)
  - **Acceptance Criteria**:
    - Set `output: 'export'` for static file generation
    - Set `basePath: '/mcp-learning-platform'` for production (environment-based)
    - Set `images.unoptimized: true` (GitHub Pages requirement)
    - Set `trailingSlash: true` for directory routing
    - Validate config with `next build` (should succeed locally)
  - **Reference**: research.md "Next.js Static Export Configuration"

- [x] **T002** [P] Create scripts/prepare-static.js for 404.html fallback
  - **Type**: Infrastructure Script
  - **Dependencies**: None
  - **Files**: `scripts/prepare-static.js` (new file)
  - **Acceptance Criteria**:
    - Copy `out/404/index.html` to `out/404.html` for GitHub Pages SPA routing
    - Add error handling for missing source file
    - Output success message with file paths
    - Make script idempotent (safe to run multiple times)
  - **Reference**: research.md "Client-Side Routing Fallback Strategy"

- [x] **T003** [P] Update package.json with build:static script
  - **Type**: Configuration
  - **Dependencies**: None
  - **Files**: `package.json` (modify existing)
  - **Acceptance Criteria**:
    - Add `"build:static": "next build && node scripts/prepare-static.js"` to scripts section
    - Ensure script runs `next build` first, then prepare-static.js
    - Test locally: `npm run build:static` should complete without errors
    - Verify `out/` directory created with static files and `out/404.html` exists
  - **Reference**: data-model.md "Package.json Scripts"

## Wave 2: Infrastructure (Sequential - Depends on Wave 1)

- [x] **T004** Create .github/workflows/deploy.yml for GitHub Pages deployment
  - **Type**: CI/CD Infrastructure
  - **Dependencies**: T001, T002, T003 (needs config files to reference)
  - **Files**: `.github/workflows/deploy.yml` (new file)
  - **Acceptance Criteria**:
    - Set workflow name: "Deploy to GitHub Pages"
    - Trigger on: `push.branches: [main]` and `workflow_dispatch`
    - Set permissions: `contents: read`, `pages: write`, `id-token: write`
    - Set concurrency: `group: "pages"`, `cancel-in-progress: false`
    - **Build job**:
      - Runs on: `ubuntu-latest`
      - Steps: checkout@v4, setup-node@v4 (Node 20, npm cache), npm ci, npm run build:static
      - Upload artifact: `actions/upload-pages-artifact@v3` with path `./out`
    - **Deploy job**:
      - Depends on: build job (`needs: build`)
      - Environment: `github-pages` with deployment URL output
      - Steps: `actions/deploy-pages@v4`
    - Validate YAML syntax with GitHub Actions schema (commit to branch, check for errors)
  - **Reference**: research.md "GitHub Actions Workflow Design", data-model.md "GitHub Actions Workflow Definition"

- [x] **T005** Update .gitignore for deployment artifacts
  - **Type**: Configuration
  - **Dependencies**: T001, T002, T003 (needs to know what to ignore)
  - **Files**: `.gitignore` (modify existing)
  - **Acceptance Criteria**:
    - Add `out/` to gitignore (static export output)
    - Verify `.next/` already ignored (Next.js build cache)
    - Add `node_modules/` if not already present
    - Test: Run `npm run build:static` then `git status` - `out/` should not appear

## Wave 3: Build Validation Tests (Parallel Execution)

- [x] **T006** [P] Test next.config.js validation
  - **Type**: Build Validation Test
  - **Dependencies**: T001 (config must exist)
  - **Files**: Manual validation (no new files)
  - **Acceptance Criteria**:
    - Run `npm run dev` - server starts successfully
    - Run `npm run build:static` - completes without errors
    - Verify `out/` directory created
    - Check `out/index.html` exists and contains basePath references
    - Verify `out/_next/` directory contains static assets
  - **Reference**: quickstart.md "Testing Deployment Changes"

- [x] **T007** [P] Test prepare-static.js script execution
  - **Type**: Script Validation Test
  - **Dependencies**: T002, T003 (script and build command must exist)
  - **Files**: Manual validation (no new files)
  - **Acceptance Criteria**:
    - Run `npm run build:static`
    - Verify `out/404.html` exists (not just `out/404/index.html`)
    - Verify `out/404.html` content matches `out/404/index.html`
    - Run script twice - second run should succeed (idempotent)
  - **Reference**: data-model.md "Package.json Scripts"

- [ ] **T008** [P] Test workflow YAML syntax validation
  - **Type**: Workflow Validation Test
  - **Dependencies**: T004 (workflow file must exist)
  - **Files**: Manual validation (no new files)
  - **Acceptance Criteria**:
    - Commit `.github/workflows/deploy.yml` to branch
    - Push to GitHub
    - Visit repository Actions tab - no YAML syntax errors
    - Manually trigger workflow (workflow_dispatch) - should queue
    - Verify both jobs (build, deploy) appear in workflow run
  - **Reference**: quickstart.md "Scenario 4: Manual Deployment Trigger"

- [x] **T009** [P] Test static export structure validation
  - **Type**: Build Validation Test
  - **Dependencies**: T001, T002, T003 (full build pipeline)
  - **Files**: Manual validation (no new files)
  - **Acceptance Criteria**:
    - Run `npm run build:static`
    - Verify `out/` contains all routes as HTML files or directories
    - Check key files exist: `out/index.html`, `out/progress/index.html`, `out/knowledge-map/index.html`
    - Verify `out/_next/static/` contains JS/CSS bundles with hashed filenames (cache-busting)
    - Test locally: `npx serve out -p 8080` and visit `http://localhost:8080/mcp-learning-platform/`
    - Navigate to `/mcp-learning-platform/progress` - page loads correctly
  - **Reference**: quickstart.md "Testing Deployment Changes"

## Wave 4: Documentation (Sequential - After Implementation)

- [ ] **T010** Update README.md with deployment information
  - **Type**: Documentation
  - **Dependencies**: T001-T009 (all implementation and testing complete)
  - **Files**: `README.md` (modify existing)
  - **Acceptance Criteria**:
    - Add "Deployment" section with:
      - GitHub Pages URL format: `https://[username].github.io/mcp-learning-platform/`
      - Local testing instructions: `npm run build:static && npx serve out -p 8080`
      - Deployment trigger: "Automatic on merge to main branch"
      - Build time: "~4-5 minutes (cached), ~7-8 minutes (cold)"
    - Add "Development" section clarification:
      - `npm run dev` - Local development (port 3000)
      - `npm run build:static` - Test static export locally
    - Link to quickstart.md for deployment validation scenarios
  - **Reference**: quickstart.md "Prerequisites", research.md "Build Performance Optimization"

## Wave 5: Manual Deployment Validation (Sequential - After Deployment)

**IMPORTANT**: These tasks require actual deployment to GitHub Pages. Execute in order after T001-T010 are complete and changes are merged to main.

- [ ] **T011** Validate Scenario 1: First-Time Deployment
  - **Type**: Manual Validation
  - **Dependencies**: T001-T010, changes merged to main
  - **Files**: Manual testing (no new files)
  - **Acceptance Criteria**:
    - GitHub Pages enabled in repository settings (Settings → Pages → Source: GitHub Actions)
    - Make test commit to main branch
    - Workflow triggers automatically within 10 seconds
    - Build job completes successfully
    - Deploy job completes successfully
    - Total time < 10 minutes
    - Visit GitHub Pages URL - site loads (HTTP 200)
    - No console errors in browser DevTools
  - **Reference**: quickstart.md "Scenario 1: First-Time Deployment (Happy Path)"

- [ ] **T012** Validate Scenario 2: Client-Side Routing
  - **Type**: Manual Validation
  - **Dependencies**: T011 (site must be deployed)
  - **Files**: Manual testing (no new files)
  - **Acceptance Criteria**:
    - Direct navigation to `https://[username].github.io/mcp-learning-platform/progress` - loads correctly
    - Direct navigation to `https://[username].github.io/mcp-learning-platform/knowledge-map` - loads correctly
    - Click navigation links - routing works without full page reload
    - Hard refresh (Ctrl+Shift+R) on any route - page loads correctly
    - No 404 errors in browser network tab
    - Browser back/forward buttons work
  - **Reference**: quickstart.md "Scenario 2: Client-Side Routing Test"

- [ ] **T013** Validate Scenario 3: Deployment Failure Handling
  - **Type**: Manual Validation
  - **Dependencies**: T011 (working deployment)
  - **Files**: Manual testing (no new files)
  - **Acceptance Criteria**:
    - Create test branch with intentional build error (e.g., syntax error in component)
    - Create PR to main
    - Workflow runs and build job fails with error message
    - Deploy job does not run (skipped)
    - PR shows red X on status check
    - Previous deployment remains accessible at GitHub Pages URL
    - Merge is blocked if branch protection enabled
  - **Reference**: quickstart.md "Scenario 3: Deployment Failure Handling"

- [ ] **T014** Validate Scenario 4: Manual Deployment Trigger
  - **Type**: Manual Validation
  - **Dependencies**: T011 (workflow must exist)
  - **Files**: Manual testing (no new files)
  - **Acceptance Criteria**:
    - Visit repository Actions tab
    - Click "Deploy to GitHub Pages" workflow
    - Click "Run workflow" button - dropdown appears
    - Select branch: main
    - Click green "Run workflow" button
    - Workflow run appears immediately with "manually triggered" label
    - Build and deploy jobs complete successfully
    - GitHub Pages URL serves latest content (no change expected, re-deployment)
  - **Reference**: quickstart.md "Scenario 4: Manual Deployment Trigger"

- [ ] **T015** Validate Scenario 5: Rollback to Previous Version
  - **Type**: Manual Validation
  - **Dependencies**: T011 (deployed site with history)
  - **Files**: Manual testing (no new files)
  - **Acceptance Criteria**:
    - Make identifiable change (e.g., add console.error to layout.tsx)
    - Commit and push to main - wait for deployment (~5 min)
    - Visit GitHub Pages URL - verify change is live (see error in console)
    - Run `git log --oneline -5` - note commit SHAs
    - Run `git revert [bad-commit-sha]` and push to main
    - Wait for deployment (~8-10 min total for rollback)
    - Visit GitHub Pages URL - verify change is reverted (error gone)
    - No downtime observed during rollback
  - **Reference**: quickstart.md "Scenario 5: Rollback to Previous Version"

## Wave 6: Final Validation & Completion

- [ ] **T016** Run comprehensive deployment checklist
  - **Type**: Final Validation
  - **Dependencies**: T011-T015 (all scenarios validated)
  - **Files**: Manual validation (no new files)
  - **Acceptance Criteria**:
    - **FR-001**: ✅ Automatic trigger on main merge verified (T011)
    - **FR-002**: ✅ Static build process verified (T006, T009)
    - **FR-003**: ✅ GitHub Pages deployment verified (T011)
    - **FR-004**: ✅ Deployment status visibility verified (T011, T013)
    - **FR-005**: ✅ HTTPS access without auth verified (T011)
    - **FR-006**: ✅ Client-side routing verified (T012)
    - **FR-007**: ✅ Cache-busting verified (T009 - hashed filenames)
    - **FR-008**: ✅ Graceful failure verified (T013)
    - **FR-009**: ✅ <10 minute deployment verified (T011)
    - **NFR-001**: ✅ Zero-downtime verified (T015 - rollback)
    - **NFR-002**: ✅ Stable URL verified (T011-T015)
    - **NFR-003**: ✅ 90-day logs verified (GitHub Actions retention)
    - **NFR-004**: ✅ Complete assets verified (T009)
  - **Reference**: spec.md "Requirements" section

- [ ] **T017** Update feature status documentation
  - **Type**: Documentation
  - **Dependencies**: T016 (all requirements validated)
  - **Files**: `specs/005-i-want-to/spec.md` (modify existing)
  - **Acceptance Criteria**:
    - Change `**Status**: Draft` to `**Status**: Complete`
    - Add "Validation Results" section with:
      - All 9 FRs marked ✅ PASS
      - All 4 NFRs marked ✅ PASS
      - Deployment URL documented
      - Build time benchmarks (cached vs cold)
    - Add completion date

- [ ] **T018** Create deployment runbook for future reference
  - **Type**: Documentation
  - **Dependencies**: T016 (all scenarios validated)
  - **Files**: `docs/deployment-runbook.md` (new file, optional)
  - **Acceptance Criteria**:
    - Document common issues from quickstart.md troubleshooting section
    - Add rollback procedure (git revert workflow)
    - List monitoring URLs (Actions tab, GitHub Pages settings)
    - Include contact information for GitHub Pages support
    - Link to quickstart.md for detailed validation scenarios
  - **Reference**: quickstart.md "Common Issues & Troubleshooting"

## Dependencies Visualization

```
Wave 1 (Config - Parallel):
├─ T001 [P] next.config.js
├─ T002 [P] prepare-static.js
└─ T003 [P] package.json

    ↓

Wave 2 (Infrastructure - Sequential):
├─ T004 deploy.yml (needs T001-T003 config context)
└─ T005 .gitignore (needs T001-T003 to know what to ignore)

    ↓

Wave 3 (Tests - Parallel):
├─ T006 [P] next.config.js validation (needs T001)
├─ T007 [P] prepare-static.js validation (needs T002, T003)
├─ T008 [P] workflow YAML validation (needs T004)
└─ T009 [P] static export validation (needs T001-T003)

    ↓

Wave 4 (Documentation):
└─ T010 README.md (needs T001-T009 complete)

    ↓

Wave 5 (Manual Deployment Validation - Sequential):
├─ T011 First deployment (needs T001-T010 + merge to main)
├─ T012 Client routing (needs T011 - site deployed)
├─ T013 Failure handling (needs T011 - working deployment)
├─ T014 Manual trigger (needs T011 - workflow exists)
└─ T015 Rollback (needs T011 - deployment history)

    ↓

Wave 6 (Final Validation):
├─ T016 Comprehensive checklist (needs T011-T015)
├─ T017 Feature status update (needs T016)
└─ T018 Runbook creation (needs T016)
```

## Parallel Execution Examples

### Wave 1: Configuration Files (Run Together)

```bash
# Terminal 1
Task: "Create next.config.js modifications for GitHub Pages static export"

# Terminal 2
Task: "Create scripts/prepare-static.js for 404.html fallback"

# Terminal 3
Task: "Update package.json with build:static script"
```

### Wave 3: Build Validation Tests (Run Together)

```bash
# Terminal 1
Task: "Test next.config.js validation - run npm run build:static and verify output"

# Terminal 2
Task: "Test prepare-static.js script execution - verify out/404.html created"

# Terminal 3
Task: "Test workflow YAML syntax validation - push to GitHub and check Actions tab"

# Terminal 4
Task: "Test static export structure validation - verify all routes in out/ directory"
```

## Notes

### TDD Approach for Infrastructure

This feature is **infrastructure-only** (no application code changes), so traditional TDD (write failing tests first) is adapted:

1. **Configuration as Tests**: Config files themselves validate build process
   - `next.config.js` validates via `next build`
   - `deploy.yml` validates via GitHub Actions YAML parser

2. **Build Validation as Tests**: Wave 3 tasks verify configuration works
   - T006-T009 are "tests" that verify config correctness
   - Must pass before deployment (T011+)

3. **Manual Validation**: Wave 5 tasks validate deployment in production
   - Each quickstart scenario = integration test
   - Execute after code is live

### Commit Strategy

- **After Wave 1**: Commit all config files together ("feat: configure Next.js static export for GitHub Pages")
- **After Wave 2**: Commit infrastructure ("feat: add GitHub Actions deployment workflow")
- **After Wave 3**: No commit (tests only validate)
- **After Wave 4**: Commit docs ("docs: add deployment information to README")
- **After Wave 5**: Document results in spec.md (T017)

### Rollback Plan

If deployment breaks production:

1. Identify bad commit SHA: `git log --oneline -5`
2. Revert: `git revert [bad-sha]`
3. Push to main: Triggers new deployment (~8-10 min)
4. Previous version stays live during rollback (zero downtime)

## Validation Checklist

*GATE: Checked before marking feature complete*

- [x] All config entities from data-model.md have implementation tasks (T001-T005)
- [x] All research decisions from research.md have corresponding tasks (T001-T004)
- [x] All quickstart scenarios have validation tasks (T011-T015)
- [x] All functional requirements have validation tasks (T016)
- [x] Tests come before dependent implementation (Wave 3 before Wave 5)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Dependency graph is acyclic and correctly ordered

## Task Generation Rules Applied

1. **From Data Model** (5 config entities):
   - NextConfig → T001 (next.config.js)
   - Workflow YAML → T004 (deploy.yml)
   - Package.json Scripts → T003 (build:static)
   - Prepare-static script → T002 (prepare-static.js)
   - Gitignore → T005 (.gitignore)

2. **From Research** (6 technical decisions):
   - Next.js Static Export → T001, T006
   - GitHub Actions Workflow → T004, T008
   - Client-Side Routing Fallback → T002, T007, T012
   - Build Performance → T009, T011
   - GitHub Pages Config → T011 (manual setup in GitHub UI)
   - Security Scanning → Out of scope (Dependabot setup post-deployment)

3. **From Quickstart** (5 validation scenarios):
   - Scenario 1 → T011 (first deployment)
   - Scenario 2 → T012 (client routing)
   - Scenario 3 → T013 (failure handling)
   - Scenario 4 → T014 (manual trigger)
   - Scenario 5 → T015 (rollback)

4. **Ordering Rules**:
   - Setup (T001-T005) → Tests (T006-T009) → Docs (T010) → Validation (T011-T018)
   - Config files parallel (different files)
   - Workflow sequential after config (needs context)
   - Tests parallel (different validation aspects)
   - Manual validation sequential (each builds on previous)

---

**Status**: ✅ Ready for execution  
**Estimated Time**:

- Wave 1-4: ~2-3 hours (implementation + local testing)
- Wave 5: ~1-2 hours (manual deployment validation, depends on GitHub Actions queue)
- Wave 6: ~30 minutes (documentation)
- **Total**: ~4-6 hours for complete feature implementation and validation
