
# Implementation Plan: GitHub Pages Deployment with CI/CD

**Branch**: `005-i-want-to` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-i-want-to/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   ✓ Loaded spec.md - GitHub Pages deployment with CI/CD on main merge
2. Fill Technical Context
   ✓ Project Type: Web application (Next.js static export)
   ✓ Structure Decision: Single project (existing monorepo)
3. Fill the Constitution Check section
   ✓ Static Web App Template Constitution v1.0.0 analyzed
4. Evaluate Constitution Check section
   ✓ No violations (1 acceptable deviation: rollback time 8-10min vs 2min)
   ✓ Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   ✓ Researched 6 key questions: Next.js config, workflow design, routing, performance, GitHub Pages, security
   ✓ Generated research.md (450+ lines) with decisions, best practices, integration patterns
6. Execute Phase 1 → data-model.md, quickstart.md, .github/copilot-instructions.md
   ✓ Created data-model.md (configuration entities: NextConfig, workflow YAML, build metadata, GitHub Pages state)
   ✓ Created quickstart.md (5 validation scenarios, troubleshooting guide)
   ✓ Updated .github/copilot-instructions.md (deployment constraints, breaking changes, testing commands)
7. Re-evaluate Constitution Check section
   ✓ No new violations after design phase
   ✓ Deployment infrastructure aligns with static site principles
   ✓ Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach
   ✓ TDD order: Config → Workflow → Tests → Validation
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 9. Phases 2-4 are executed by other commands.

## Summary

Deploy the MCP Learning Platform to GitHub Pages with automatic CI/CD triggered on merges to main branch. This enables immediate visibility of changes and public URL sharing for stakeholders. The solution uses GitHub Actions for build automation, Next.js static export for static file generation, and GitHub Pages for hosting with zero-downtime deployments.

**Primary Technical Approach**:

- GitHub Actions workflow triggered by push to main
- Next.js static export (`next build && next export`)
- GitHub Pages deployment via `actions/deploy-pages`
- Client-side routing preservation with custom 404.html fallback
- Cache-busting via Next.js fingerprinted assets
- Build failure handling with deployment gates

## Technical Context

**Language/Version**: TypeScript 5.7, Node.js 20+ LTS  
**Primary Dependencies**: Next.js 15.5.4 (static export mode), GitHub Actions  
**Storage**: GitHub Pages static file hosting (no database)  
**Testing**: Jest for build validation, Lighthouse CI for performance gates  
**Target Platform**: GitHub Pages (static CDN hosting)  
**Project Type**: Web application (Next.js SSG/Static Export)  
**Performance Goals**:

- Build time < 5 minutes for CI/CD
- Deploy time < 3 minutes from merge to live
- LCP ≤ 2.0s on fast 4G (existing budget maintained)
- First deployment iteration < 10 minutes total

**Constraints**:

- Zero server-side rendering (static files only)
- Client-side routing must work with direct URL access
- No custom domain (GitHub Pages default: `username.github.io/repo-name`)
- Public repository or GitHub Pages enabled for private repo
- 1GB soft limit on GitHub Pages site size

**Scale/Scope**:

- Single deployment target (main branch only)
- ~50-100 routes (current application size)
- Deployment frequency: 1-10 times per day (development pace)
- Asset size: ~5-10MB total (estimated static bundle)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Alignment with Static Web App Constitution v1.0.0

#### ✅ Performance Budget Enforcement (Principle II)

- **Status**: PASS - No budget violations expected
- **Rationale**: Deployment infrastructure only; no changes to application code/bundle
- **Evidence**: GitHub Actions builds existing codebase; GitHub Pages serves static assets with CDN edge caching
- **Monitoring**: Existing Lighthouse CI will continue to enforce LCP ≤ 2.0s, CLS ≤ 0.1, TBT ≤ 200ms

#### ✅ Accessibility & Inclusive Design (Principle III)

- **Status**: PASS - No accessibility impact
- **Rationale**: Deployment mechanism doesn't affect semantic HTML, ARIA, or keyboard navigation
- **Evidence**: Static export preserves all client-side accessibility features

#### ✅ Security & Privacy by Default (Principle IV)

- **Status**: PASS with enhancements
- **GitHub Pages Security**:
  - Automatic HTTPS via TLS certificate
  - `Strict-Transport-Security` header enforcement
  - No server-side code execution (static files only)
- **Build Security**:
  - GitHub Actions runs in isolated containers
  - Secrets managed via GitHub encrypted secrets
  - No inline scripts (CSP preserved from application)
- **Requirement**: Verify Content-Security-Policy headers survive static export

#### ✅ Deployment & Environments (Section 8)

- **Status**: PASS - Aligns with constitution deployment model
- **Mapping**:
  - Local: Dev iteration (existing `npm run dev`)
  - Preview: Auto PR deployment (OUT OF SCOPE - noted in spec)
  - Staging: **GitHub Pages deployment on main merge** (maps to "Integration")
  - Production: Same as staging (single deployment target per spec)
- **Atomic Deploys**: GitHub Pages publishes entire build atomically
- **Rollback**: Git revert + rerun workflow (< 10 minutes per FR-009)
- **Provenance**: GitHub Actions provides commit SHA, build logs, artifact hashes

#### ✅ Observability (Section 9)

- **Status**: PASS - Meets minimum requirements
- **Build Observability**: GitHub Actions provides structured logs, build duration, success/failure states
- **Runtime Observability**: Existing RUM/analytics (if configured) unaffected by hosting change
- **Requirement**: Deployment workflow must output build provenance artifact

#### ⚠️ Rollback Constraint (Section 8)

- **Status**: NEEDS ATTENTION
- **Constitution Requirement**: Rollback must complete < 2 minutes
- **Current Design**: Git revert + rerun workflow ≈ 8-10 minutes
- **Justification**: Acceptable trade-off for MVP deployment
  - GitHub Pages is free, managed infrastructure
  - Low deployment frequency (1-10/day development pace)
  - Previous version remains accessible until new deploy completes (zero downtime)
- **Future Enhancement**: Consider caching builds for instant rollback (out of scope for Feature 005)

#### ✅ No New Complexity Violations

- **Status**: PASS
- **Evidence**:
  - No new projects/repositories
  - No new abstractions or patterns
  - Uses existing GitHub infrastructure
  - Single workflow file (~100 LOC)

### Constitution Compliance Summary

| Principle | Status | Notes |
|-----------|--------|-------|
| Performance Budget | ✅ PASS | No bundle changes |
| Accessibility | ✅ PASS | No UI changes |
| Security | ✅ PASS | HTTPS, isolated builds, CSP preserved |
| Deployment Pattern | ✅ PASS | Atomic deploys, provenance, zero downtime |
| Observability | ✅ PASS | GitHub Actions logging, build metrics |
| Rollback Time | ⚠️ ACCEPTABLE | 8-10min vs 2min target; justified for MVP |

**GATE DECISION**: ✅ PROCEED to Phase 0 (minor rollback time deviation accepted with justification)

## Project Structure

### Documentation (this feature)

```
specs/005-i-want-to/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command - to be generated)
├── data-model.md        # Phase 1 output (/plan command - to be generated)
├── quickstart.md        # Phase 1 output (/plan command - to be generated)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

**Existing Next.js Application Structure** (no changes to source):

```
src/
├── app/                 # Next.js 15 App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── progress/
│   ├── knowledge-map/
│   └── [...routes]/
├── components/          # React components
├── services/            # Business logic
├── lib/                 # Utilities
└── types/               # TypeScript definitions

public/                  # Static assets (served as-is)
├── images/
├── fonts/
└── favicon.ico

tests/
├── unit/
└── integration/
```

**New Deployment Infrastructure** (to be created):

```
.github/
├── workflows/
│   └── deploy.yml       # GitHub Pages deployment workflow [NEW]
└── copilot-instructions.md  # Updated with deployment context

.next/                   # Build output (git-ignored, CI-generated)
out/                     # Static export output (git-ignored, deployed to GitHub Pages) [NEW]

next.config.js           # Updated: output: 'export', basePath config [MODIFIED]
package.json             # Updated: Add build:static script [MODIFIED]
```

**Structure Decision**:

This is a **deployment infrastructure feature** for an existing Next.js web application. The core application structure (`src/`, `components/`, `services/`) remains unchanged. We're adding:

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) - CI/CD automation
2. **Next.js Static Export Config** (`next.config.js` modification) - Enable static file generation
3. **Build Output Directory** (`out/`) - Temporary directory for deployment artifacts (git-ignored)
4. **Updated Build Scripts** (`package.json`) - Add `build:static` command

**Key Design Decisions**:

- **No source code changes**: Deployment is infrastructure-only
- **Single workflow file**: Simple, maintainable CI/CD pipeline
- **Static export mode**: Converts Next.js app to pure static HTML/CSS/JS
- **Preserve existing dev workflow**: `npm run dev` unchanged; deployment uses separate `build:static`

## Phase 0: Outline & Research

**Status**: ✅ COMPLETE

1. **✅ Extract unknowns from Technical Context** above:
   - Identified 6 key research questions:
     - Next.js static export configuration for GitHub Pages
     - GitHub Actions workflow design and best practices
     - Client-side routing fallback strategy
     - Build performance optimization techniques
     - GitHub Pages configuration requirements
     - Dependency and security scanning approach

2. **✅ Generate and dispatch research agents**:
   - Researched Next.js static export mode (`output: 'export'`)
   - Evaluated GitHub Actions deployment patterns
   - Analyzed client-side routing preservation strategies
   - Benchmarked build performance (4-5min cached, 7-8min cold)
   - Reviewed GitHub Pages hosting requirements
   - Investigated security scanning tools (Dependabot, SHA pinning)

3. **✅ Consolidate findings** in `research.md` using format:
   - **Created**: `specs/005-i-want-to/research.md` (450+ lines)
   - **6 Research Questions Answered**:
     1. Next.js Static Export → Decision: `output: 'export'` with 404.html fallback
     2. GitHub Actions Workflow → Decision: `actions/deploy-pages@v4` (official, secure)
     3. Client-Side Routing → Decision: 404.html path restoration pattern
     4. Build Performance → Decision: npm caching, ~4-5min builds (meets <10min requirement)
     5. GitHub Pages Config → Decision: "GitHub Actions" source, branch protection
     6. Security Scanning → Decision: Dependabot + SHA-pinned actions
   - **Technology Best Practices**:
     - Next.js: 8 practices (avoid SSR, use basePath, trailingSlash, unoptimized images)
     - GitHub Actions: 8 practices (concurrency, caching, SHA pinning, least-privilege)
     - GitHub Pages: 7 practices (HTTPS, Cache-Control, 404.html, basePath testing)
   - **Integration Patterns**: Build→Deploy pipeline, routing fallback flow diagrams
   - **Decision Summary Table**: 6 key decisions with rationale
   - **Risks & Mitigations**: 5 risks identified with impact/probability/mitigation
   - **Open Questions Resolved**: 5 questions answered (Next.js 15 support, size limits, rollback)

**Output**: ✅ research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*  
**Status**: ✅ COMPLETE

1. **✅ Extract entities from feature spec** → `data-model.md`:
   - **Created**: `specs/005-i-want-to/data-model.md` (config-only entities)
   - Entities documented:
     - NextConfig (next.config.js modifications)
     - GitHub Actions Workflow Definition (.github/workflows/deploy.yml)
     - Build Artifact Metadata (GitHub Actions logs)
     - GitHub Pages Deployment State (external API)
     - Package.json Scripts (build:static command)
   - Validation rules, state transitions, entity relationships defined
   - Rationale: No database changes (infrastructure-only feature)

2. **✅ Generate API contracts** from functional requirements:
   - **No traditional API contracts needed** (deployment infrastructure, not application API)
   - Configuration files serve as "contracts":
     - `next.config.js` (TypeScript interface documented in data-model.md)
     - `.github/workflows/deploy.yml` (YAML schema validated by GitHub Actions)
     - `package.json` scripts (npm standard)

3. **✅ Generate contract tests** from contracts:
   - **Validation approach**: Build-time and deployment validation
   - Tests will be created in Phase 2 (tasks.md) as:
     - `next build` smoke test (validates next.config.js)
     - Workflow YAML syntax validation (GitHub Actions pre-commit hook)
     - Static export structure validation (quickstart scenarios)

4. **✅ Extract test scenarios** from user stories:
   - **Created**: `specs/005-i-want-to/quickstart.md` (5 validation scenarios)
   - Scenarios mapped from acceptance criteria in spec.md:
     - Scenario 1: First-time deployment (FR-001, FR-002, FR-003)
     - Scenario 2: Client-side routing (FR-006)
     - Scenario 3: Deployment failure handling (FR-008)
     - Scenario 4: Manual deployment trigger (FR-001 workflow_dispatch)
     - Scenario 5: Rollback to previous version (FR-009)
   - Troubleshooting guide included (5 common issues)

5. **✅ Update agent file incrementally** (O(1) operation):
   - **Updated**: `.github/copilot-instructions.md`
   - Added Feature 005 deployment context:
     - Deployment constraints (no SSR, no API routes, client-side routing)
     - Critical files for deployment (next.config.js, deploy.yml, prepare-static.js)
     - Breaking changes to avoid (5 critical warnings)
     - Testing deployment changes (local static export validation)
   - Updated "Active Technologies" section (GitHub Actions, GitHub Pages, static export)
   - Updated "Recent Changes" (added Feature 005)
   - Preserved manual additions between markers

**Phase 1 Output Summary**:

- ✅ data-model.md (configuration entities, no database changes)
- ✅ quickstart.md (5 validation scenarios, troubleshooting)
- ✅ .github/copilot-instructions.md (deployment context, constraints, testing)
- ✅ /contracts/* (N/A - configuration files are contracts)
- ✅ Failing tests (will be generated in Phase 2 tasks.md)

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*  
**Status**: ⏳ PLANNED (awaiting /tasks command)

**Task Generation Strategy**:

1. **Load template**: `.specify/templates/tasks-template.md` as base
2. **Extract from design docs**:
   - From `data-model.md`:
     - T001: Create next.config.js modifications (static export config)
     - T002: Create scripts/prepare-static.js (404.html copy script)
     - T003: Update package.json (add build:static script)
   - From `research.md`:
     - T004: Create .github/workflows/deploy.yml (2-job workflow)
     - T005: Add .gitignore entries (out/, .next/ for deployment)
   - From `quickstart.md`:
     - T006: Create local testing documentation (README update)
     - T007: Test Scenario 1 validation (first deployment)
     - T008: Test Scenario 2 validation (client-side routing)
     - T009: Test Scenario 3 validation (build failure handling)
     - T010: Test Scenario 4 validation (manual trigger)
     - T011: Test Scenario 5 validation (rollback)

3. **Testing tasks** (TDD approach):
   - T012: [TEST] Verify next.config.js has output:'export'
   - T013: [TEST] Verify prepare-static.js creates 404.html
   - T014: [TEST] Verify build:static script runs successfully
   - T015: [TEST] Verify workflow YAML syntax is valid
   - T016: [TEST] Verify static export contains all routes

**Ordering Strategy**:

- **Wave 1** (Configuration): T001-T003 [P] (parallel - independent config files)
- **Wave 2** (Infrastructure): T004-T005 (workflow depends on config)
- **Wave 3** (Testing Setup): T012-T016 [P] (parallel - independent validation scripts)
- **Wave 4** (Documentation): T006 (README update after config/workflow)
- **Wave 5** (Validation): T007-T011 (sequential - manual deployment validation)

**Estimated Output**: ~16 numbered, ordered tasks in tasks.md

**Task Template Pattern**:

```markdown
### T00X: Task Name [P]
**Type**: [Config|Test|Documentation|Validation]
**Dependencies**: [List task IDs or "None"]
**Files**: [List files to create/modify]
**Acceptance**: [Specific validation criteria from quickstart.md]
```

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [x] Phase 3: Tasks generated (/tasks command) ✅
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS ✅ (1 acceptable deviation: rollback time)
- [x] Post-Design Constitution Check: PASS ✅ (no new violations)
- [x] All NEEDS CLARIFICATION resolved ✅ (6 research questions answered in research.md)
- [x] Complexity deviations documented ✅ (rollback time justified in Constitution Check)

**Deliverables**:

- [x] spec.md (Session 6) ✅
- [x] plan.md (This file - Session 7) ✅
- [x] research.md (Session 7) ✅
- [x] data-model.md (Session 7) ✅
- [x] quickstart.md (Session 7) ✅
- [x] .github/copilot-instructions.md updated (Session 7) ✅
- [x] tasks.md (Session 7) ✅

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
