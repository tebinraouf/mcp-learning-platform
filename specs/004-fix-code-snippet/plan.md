
# Implementation Plan: UI Fixes - Code Snippets, Knowledge Map Progress, and Time Tracking

**Branch**: `004-fix-code-snippet` | **Date**: October 5, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-fix-code-snippet/spec.md`

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

**Primary Requirement**: Fix three UI/calculation issues in the MCP Learning Platform:

1. Improve code snippet readability with proper styling and contrast
2. Display concept mastery levels on knowledge map based on quiz performance  
3. Fix session time tracking calculation to use start timestamp

**Technical Approach**: Minimal changes to existing components following established architecture:

- Update MarkdownRenderer component styling for code blocks (CSS/Tailwind)
- Add mastery calculation logic to knowledge map page using quiz performance data
- Fix LearnerService time tracking to use session start timestamp properly
- Use existing libraries (react-markdown, context7 for documentation if needed)
- No new dependencies, no data model changes, purely UI and calculation fixes

## Technical Context

**Language/Version**: TypeScript 5.7 (strict mode), React 18.3.0, Next.js 15.5.4
**Primary Dependencies**: react-markdown, remark-gfm, Tailwind CSS, shadcn/ui, mermaid  
**Storage**: SessionStorage (browser) via StorageService abstraction
**Testing**: Jest + React Testing Library (existing tests to be preserved)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web (Next.js static export with frontend only, no backend)
**Performance Goals**: <100ms for mastery calculations, no impact on page load times
**Constraints**: Maintain WCAG AA accessibility, no regression in existing functionality, session-based only
**Scale/Scope**: Client-side only, 5 learning stages, ~30 concepts, single-user session

**User-Provided Implementation Details**:

- Follow the same architecture of the app
- Implement changes with minimum changes to existing code
- For code snippets, use existing libraries to show code snippets
- Use context7 for documentation lookup if needed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Performance Budget Compliance

- [x] **LCP Budget**: No changes to page load critical path (pure CSS/calculation fixes)
- [x] **JS Budget**: No new JS added (<160KB total maintained)  
- [x] **CSS Budget**: Minor CSS additions within existing Tailwind utility classes (<25KB critical CSS)
- [x] **Mastery Calculation**: Must complete in <100ms (NFR-002 from spec)

### Accessibility (WCAG 2.1 AA)

- [x] **Color Contrast**: Code snippet contrast improvements target ≥4.5:1 (FR-001)
- [x] **Semantic HTML**: No structural changes, maintaining existing semantic markup
- [x] **Keyboard Navigation**: No impact (no interactive element changes)
- [x] **Screen Reader**: Mastery levels will include text labels + ARIA attributes

### Security & Privacy

- [x] **No New Scripts**: Using existing dependencies only
- [x] **CSP Compliance**: No inline styles or scripts added
- [x] **Data Privacy**: Session-based only, no PII, no external calls

### Static Web App Requirements

- [x] **Static Export**: Next.js static export maintained (no SSR/ISR needed)
- [x] **Content Source**: Markdown/MDX rendering unchanged (react-markdown preserved)
- [x] **Routing**: No routing changes
- [x] **Images**: No image changes
- [x] **Forms**: No form changes

### Architecture Alignment

- [x] **Component Structure**: Modifications to existing components only (MarkdownRenderer, KnowledgeMap, progress page)
- [x] **Service Layer**: Minor logic updates to LearnerService (time calculation fix)
- [x] **Styling**: Tailwind utility-first approach maintained
- [x] **Islands/Hydration**: Client components preserved as-is

**Constitution Check Result**: ✅ PASS

All changes are incremental improvements to existing components. No architectural violations. No new dependencies. Performance budget maintained.

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

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

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

The `/tasks` command will generate a structured task list using `.specify/templates/tasks-template.md` as the base. Given the research and design artifacts created in Phases 0-1, the task breakdown will follow this approach:

**1. Code Block Styling Tasks (FR-001, FR-002, FR-003)**:

- **T001**: Update `MarkdownRenderer.tsx` with Tailwind CSS utilities for code blocks
  - Add `.markdown-content pre` and `.markdown-content code` styling
  - Implement light/dark mode variants with verified WCAG AA contrast
  - Test: Verify 4.5:1 contrast in both modes via DevTools
  - **[P]** Can run in parallel with time tracking tasks

- **T002**: Test code snippet rendering across markdown content
  - Test: Light mode code blocks (FR-001)
  - Test: Dark mode code blocks (FR-002)
  - Test: Inline code rendering (FR-003)
  - Acceptance: All scenarios from quickstart.md Test Scenario 1 pass

**2. Mastery Calculation & Display Tasks (FR-004, FR-005, FR-006, FR-007)**:

- **T003**: Create `calculateMastery()` utility function with tests [TDD]
  - Test: Division by zero edge case (0 questions answered)
  - Test: Accuracy calculation (various correct/total ratios)
  - Test: Rounding behavior
  - Implementation: Simple accuracy percentage formula from research.md
  - **[P]** Can run in parallel with other tasks

- **T004**: Create `getMasteryLevel()` classification function with tests [TDD]
  - Test: 0-40% → "Beginner"
  - Test: 41-70% → "Intermediate"
  - Test: 71-89% → "Advanced"
  - Test: 90-100% → "Master"
  - Implementation: Classification logic from research.md
  - **Depends on**: T003

- **T005**: Update `KnowledgeMap.tsx` to display mastery badges
  - Add mastery calculation call per concept
  - Implement color-coded badges (red/yellow/light green/dark green)
  - Add WCAG AA compliant color combinations from research.md
  - Apply `useMemo` optimization for performance
  - **Depends on**: T003, T004

- **T006**: Update knowledge map page to integrate mastery display
  - Wire up `LearnerService.getCurrentProgress()` to `KnowledgeMap` component
  - Test: Verify mastery updates after quiz completion
  - Test: Performance <100ms for 20+ concepts (NFR-002)
  - Acceptance: All scenarios from quickstart.md Test Scenario 2 pass
  - **Depends on**: T005

**3. Session Time Tracking Tasks (FR-008, FR-009)**:

- **T007**: Add `sessionStartTime` initialization logic [TDD]
  - Test: Sets timestamp on first app load
  - Test: Preserves existing timestamp on subsequent loads
  - Test: Handles missing/invalid timestamps gracefully
  - Implementation: sessionStorage check in app initialization
  - Location: `src/app/layout.tsx` or root component
  - **[P]** Can run in parallel with styling tasks

- **T008**: Create `formatDuration()` utility function with tests [TDD]
  - Test: <1 minute → "Xs" format
  - Test: 1-60 minutes → "Xm Ys" format
  - Test: >60 minutes → "Xh Ym" format
  - Test: Edge cases (0ms, negative values)
  - Implementation: Duration formatting from research.md
  - **[P]** Can run in parallel with other tasks

- **T009**: Update `LearnerService.ts` time tracking logic
  - Fix bug: Replace hardcoded timestamp with sessionStorage read
  - Use `sessionStartTime` to calculate duration
  - Apply `formatDuration()` for display
  - Test: Verify accurate duration calculation
  - **Depends on**: T007, T008

- **T010**: Update Progress page to display session time
  - Wire up time tracking to header/display component
  - Test: Duration increments on page reload
  - Test: Duration resets on browser close
  - Acceptance: All scenarios from quickstart.md Test Scenario 3 pass
  - **Depends on**: T009

**4. Integration & Validation Tasks**:

- **T011**: Run regression tests (manual from quickstart.md)
  - Test: Quiz functionality unchanged
  - Test: Stage navigation unchanged
  - Test: Knowledge map graph layout unchanged
  - Test: Markdown rendering (non-code) unchanged
  - Acceptance: No functional regressions

- **T012**: Run accessibility validation
  - Run Lighthouse audit on all pages
  - Verify WCAG AA compliance (≥4.5:1 contrast)
  - Check keyboard navigation
  - Acceptance: No new accessibility errors (NFR-004)
  - **Depends on**: All implementation tasks

- **T013**: Run performance validation
  - Run Lighthouse performance audit
  - Verify LCP ≤2.0s, CLS ≤0.1, TBT ≤200ms
  - Profile mastery calculation timing
  - Acceptance: Performance budgets maintained (NFR-001, NFR-002)
  - **Depends on**: All implementation tasks

- **T014**: Cross-browser testing
  - Test in Chrome, Firefox, Safari, Edge
  - Verify all test scenarios pass
  - Acceptance: Consistent behavior across browsers
  - **Depends on**: T012, T013

**Ordering Strategy**:

- **TDD First**: T003, T004, T007, T008 (utility functions with tests before implementation)
- **Component Updates**: T001, T005, T009, T010 (after utilities are tested)
- **Integration Tests**: T002, T006 (after component updates)
- **Validation Last**: T011-T014 (sequential, after all implementation)

**Parallelization Plan**:

- **Wave 1 [P]**: T001 (styling), T003 (mastery calc), T007 (timestamp init), T008 (duration format) - 4 tasks in parallel
- **Wave 2 [P]**: T002 (styling tests), T004 (mastery level), T009 (time service) - 3 tasks in parallel
- **Wave 3 [P]**: T005 (mastery display), T010 (time display) - 2 tasks in parallel
- **Wave 4**: T006 (mastery integration) - depends on Wave 3
- **Wave 5**: T011 → T012 → T013 → T014 (sequential validation)

**Estimated Complexity**: 14 tasks (10 implementation + 4 validation)

**Estimated Duration**: ~6 hours (aligned with spec.md estimate)

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
- [x] All NEEDS CLARIFICATION resolved (none found)
- [x] Complexity deviations documented (none - no violations)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
