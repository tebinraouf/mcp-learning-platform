
# Implementation Plan: Modern Educational MCP Learning App

**Branch**: `001-i-m-building` | **Date**: 2025-10-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-i-m-building/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code, or `AGENTS.md` for all other agents).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Modern educational MCP learning app with staged learning path (Foundations → Architecture & Messages → Advanced Patterns → Building & Debugging → Mastery), interactive quizzes, concept knowledge map, and deep-dive landing page. Built as static Next.js site with embedded content, offline-capable, session-only progress tracking, WCAG AA compliant, performance optimized (<2.0s first interactive, ≤180KB gzip JS).

## Technical Context

**Language/Version**: TypeScript/JavaScript, Next.js 14+ with static export  
**Primary Dependencies**: Next.js, shadcn/ui, Tailwind CSS, React, context7 for MCP documentation, react-markdown, remark-gfm, rehype-mermaid  
**Content Rendering**: Markdown rendering with GitHub Flavored Markdown (GFM) support, Mermaid diagrams for educational content visualization  
**Storage**: Static embedded content (no database), sessionStorage for progress tracking  
**Testing**: Jest + React Testing Library, Playwright for E2E  
**Target Platform**: Static web app deployable to CDN/edge (Vercel, Netlify, Azure Static Web Apps)
**Project Type**: web - Static frontend with embedded educational content  
**Performance Goals**: First interactive <2.0s on 4G mid-range mobile, ≤180KB gzip JS, meaningful paint <1.2s  
**Constraints**: Offline-capable, WCAG AA compliance, session-only data persistence, responsive mobile-first  
**Scale/Scope**: 5 learning stages, 5-8 quizzes per stage, concept knowledge map, single-session anonymous users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Performance Budget Enforcement**: ✅ PASS - Spec defines hard budgets (LCP ≤ 2.0s, JS ≤ 180KB) aligned with constitution  
**Accessibility & Inclusive Design**: ✅ PASS - WCAG AA compliance, motion ≤200ms, contrast requirements specified  
**Security & Privacy by Default**: ✅ PASS - No user data collection beyond session counters, static site with no server-side secrets  
**Content & User Value First**: ✅ PASS - Clear learner personas and educational value proposition  
**Static Web App Requirements**: ✅ PASS - Fits perfectly within scope (statically generated, CDN-accelerated, educational content)

**Assessment**: No constitutional violations detected. Educational MCP app aligns with static web app template principles.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->
```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Web application (static frontend) - Educational content with embedded data structure, aligned with Next.js static export approach

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each service interface → service implementation task [P]
- Each TypeScript interface → type definition and validation task [P]
- Each user story from quickstart → integration test task
- Component creation tasks based on UI requirements from spec
- Content authoring tasks for 5 stages + concept definitions

**Ordering Strategy**:

- Setup tasks first: Next.js configuration, TypeScript setup, shadcn/ui installation
- Type definition tasks before service implementation (dependencies)
- Content structure before UI components (data-driven development)
- Core services before UI integration
- Mark [P] for parallel execution (independent files/features)

**Estimated Output**: 35-40 numbered, ordered tasks including:

- Project setup and configuration (5 tasks)
- Type definitions and data models (8 tasks)
- Service layer implementation (12 tasks)
- UI components and pages (10 tasks)
- Content authoring and integration (5 tasks)
- Testing and validation (5 tasks)

**Key Task Categories**:

1. **Foundation**: Next.js setup, TypeScript config, shadcn/ui integration
2. **Data Layer**: Embedded content structure, sessionStorage services, validation schemas
3. **Business Logic**: Learner progress, quiz engine, analytics tracking, content versioning
4. **UI Components**: Stage cards, quiz interface, knowledge map, progress indicators
5. **Integration**: Page routing, state management, performance optimization
6. **Content**: MCP educational modules, quiz questions, concept definitions (using context7)
7. **Validation**: Quickstart execution, accessibility audit, performance testing

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

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
