# Implementation Plan: Stage Progression with Passing Score Requirement

**Branch**: `003-once-a-learning` | **Date**: October 5, 2025 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-once-a-learning/spec.md`

## Execution Flow (/plan command scope)

```text
1. Load feature spec from Input path
   → Spec found at specs/003-once-a-learning/spec.md
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Project Type: web (Next.js frontend, client-side services)
   → Structure Decision: Single client-side app with service layer
3. Fill the Constitution Check section based on constitution document
   → Evaluated against Static Web App Constitution
4. Evaluate Constitution Check section
   → No violations - feature aligns with existing architecture
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → All technical details resolved from existing codebase
6. Execute Phase 1 → data-model.md, quickstart.md, update agent context
   → No new contracts needed (modifies existing QuizService)
7. Re-evaluate Constitution Check section
   → No new violations after design
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

**Primary Requirement**: Automatically unlock the next learning stage when a learner completes a stage quiz with a passing score (≥70%). This completes the missing stage progression logic for the MCP Learning Platform.

**Technical Approach**: Enhance the existing `QuizService.completeQuizAttempt()` function to call `LearnerService.completeStage()` with the next stage ID when a quiz is passed. No new services or architecture needed - simple integration of existing service methods following the established pattern.

**User Impact**: Learners will automatically progress through the 5-stage learning path when they demonstrate mastery via quiz scores, creating a seamless guided learning experience.

## Technical Context

**Language/Version**: TypeScript 5.7 (strict mode), React 18.3.0

**Primary Dependencies**: Next.js 15.5.4, session storage (built-in)

**Storage**: SessionStorage (already implemented via StorageService)

**Testing**: Jest + React Testing Library (configured)

**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)

**Project Type**: Single client-side web application with service layer

**Performance Goals**: <100ms stage progression after quiz completion

**Constraints**: Session-only storage, no server-side state, atomic status updates

**Scale/Scope**: 5 learning stages, single-user session-based progression

**User-Provided Context**: "This is a very basic feature and it should follow the existing architecture"

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Performance Budget Enforcement

- [x] No client-side JS changes expected (logic already in services)
- [x] No impact to LCP, CLS, TBT metrics (synchronous function call)
- [x] Implementation adds <1KB to existing QuizService bundle

### Accessibility & Inclusive Design

- [x] No UI changes required (uses existing dashboard components)
- [x] Visual feedback already implemented (StageCard component)
- [x] Keyboard navigation unchanged

### Security & Privacy by Default

- [x] No new data collection or storage
- [x] Uses existing session storage mechanism
- [x] No external API calls or scripts

### Static Web App Requirements

- [x] No new routing required (existing /progress page)
- [x] No forms or serverless functions needed
- [x] Reuses existing content source and navigation

### Architecture Alignment

- [x] Follows existing service layer pattern (QuizService → LearnerService)
- [x] No new abstractions (reuses completeStage method)
- [x] Maintains single client-side project structure
- [x] Consistent with session-only storage design

**Constitution Check Result**: ✅ PASS - Feature fully aligns with existing architecture and constitutional principles

## Project Structure

### Documentation (this feature)

```text
specs/003-once-a-learning/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```text
src/
├── services/
│   ├── QuizService.ts        # MODIFY: Add progression logic after quiz completion
│   ├── LearnerService.ts     # USE: Existing completeStage() method
│   ├── ContentService.ts     # USE: Existing getStage() for next stage lookup
│   └── __tests__/
│       ├── QuizService.test.ts  # MODIFY: Add progression tests
│       └── LearnerService.test.ts  # ENHANCE: Verify completeStage works
├── types/
│   └── index.ts              # NO CHANGE: All types exist
├── app/
│   ├── quiz/[stageId]/       # NO CHANGE: UI already displays progression
│   └── progress/             # NO CHANGE: Dashboard already shows unlocked stages
└── components/
    └── StageCard.tsx         # NO CHANGE: Already handles status display
```

**Structure Decision**: Single client-side web application following the established pattern. All changes are localized to the service layer (`QuizService.ts`), specifically the `completeQuizAttempt()` function. No UI changes required as the dashboard already reacts to stage status changes via existing LearnerService integration.

## Phase 0: Outline & Research

### Research Questions

**Q1**: How does the existing `completeStage()` method work?

**Finding**: The `LearnerService.completeStage(stageId, nextStageId?)` method:

- Marks the current `stageId` as 'completed'
- If `nextStageId` is provided, sets it to 'locked' (commented as "Will be set to in-progress when user clicks")
- **Issue Identified**: The current implementation sets next stage to 'locked' instead of 'in-progress'

**Decision**: Fix `completeStage()` to unlock next stage properly (set to 'in-progress', not 'locked')

**Q2**: How is the next stage determined from the current stage?

**Finding**: Each `Stage` has a `sequenceOrder` property (1-5). The `ContentService` provides:

- `getStage(stageId)` to retrieve stage details
- `getAllStages()` to get all stages

**Decision**: Find next stage by sorting stages by `sequenceOrder` and selecting the next one after current stage

**Q3**: Where should the progression logic be called?

**Finding**: `QuizService.completeQuizAttempt(attempt, quiz)` already:

- Calculates score and pass/fail status
- Updates learner's quiz attempt counters
- Returns the completed attempt with `passed: boolean`

**Decision**: Add progression logic at the end of `completeQuizAttempt()` when `passed === true`

**Q4**: What happens for the final stage (Mastery)?

**Finding**: Spec requirement FR-006: "System MUST handle the final stage completion by marking it as 'completed' without attempting to unlock a non-existent next stage"

**Decision**: Check if `nextStageId` exists before calling `completeStage()` with it

### Research Output

**No NEEDS CLARIFICATION remain** - All technical details resolved from existing codebase analysis.

**Key Findings**:

1. **Existing Bug**: `completeStage()` sets next stage to 'locked' instead of 'in-progress'
2. **Integration Point**: `QuizService.completeQuizAttempt()` is the perfect place to add progression
3. **Dependencies**: Need `ContentService.getAllStages()` to find next stage by sequence order
4. **Edge Case Handling**: Must check for final stage (no next stage exists)

## Phase 1: Design & Contracts

### Data Model Changes

**File**: `specs/003-once-a-learning/data-model.md`

**No new entities required**. All data structures already exist:

- `Learner.stageStatuses: Record<StageId, StageStatus>` (existing)
- `QuizAttempt.passed: boolean` (existing)
- `Stage.sequenceOrder: number` (existing)

**Behavior Change**:

```typescript
// BEFORE: Manual stage progression
// User passes quiz → Stage stays "in-progress" → User manually clicks next stage

// AFTER: Automatic stage progression  
// User passes quiz → Stage becomes "completed" → Next stage becomes "in-progress"
```

### Service Contract Updates

**Modified Method**: `QuizService.completeQuizAttempt()`

```typescript
/**
 * Complete a quiz attempt and calculate score.
 * If the quiz is passed, automatically mark the stage as completed
 * and unlock the next stage in the sequence.
 * 
 * @param attempt - The quiz attempt to complete
 * @param quiz - The quiz definition
 * @returns The completed quiz attempt with score and pass/fail status
 */
export function completeQuizAttempt(
    attempt: QuizAttempt,
    quiz: Quiz
): QuizAttempt
```

**Modified Method**: `LearnerService.completeStage()`

```typescript
/**
 * Mark stage as completed and unlock next stage.
 * 
 * @param stageId - The stage to mark as completed
 * @param nextStageId - The next stage to unlock (set to 'in-progress')
 * @returns Updated learner profile
 */
export function completeStage(stageId: StageId, nextStageId?: StageId): Learner
```

**New Helper Function** (internal to QuizService):

```typescript
/**
 * Find the next stage in the learning sequence.
 * 
 * @param currentStageId - The current stage ID
 * @returns The next stage ID, or undefined if current is the final stage
 */
function getNextStageId(currentStageId: StageId): StageId | undefined
```

### Implementation Plan

**Step 1**: Fix `LearnerService.completeStage()` bug

- Change `nextStageId` status from 'locked' to 'in-progress'
- Update tests to verify unlocking behavior

**Step 2**: Create `getNextStageId()` helper in QuizService

- Load all stages from ContentService
- Sort by `sequenceOrder`
- Find index of current stage
- Return next stage ID or undefined

**Step 3**: Enhance `QuizService.completeQuizAttempt()`

- After calculating pass/fail status
- If `passed === true`:
  - Find next stage using `getNextStageId()`
  - Call `LearnerService.completeStage(currentStageId, nextStageId)`

**Step 4**: Add comprehensive tests

- Test passing quiz → stage completed + next unlocked
- Test failing quiz → no progression
- Test final stage → no error when no next stage
- Test retake after pass → progression unchanged

### Quickstart Test Scenario

**File**: `specs/003-once-a-learning/quickstart.md`

**Scenario**: Complete Foundations quiz with passing score

1. Initialize learner session
2. Start Foundations stage (verify status: 'in-progress')
3. Start Foundations quiz
4. Answer questions to achieve 75% score (passing threshold 70%)
5. Complete quiz attempt
6. **Verify**: Foundations status is 'completed'
7. **Verify**: Architecture & Messages status is 'in-progress'
8. **Verify**: Other stages remain 'locked'

**Expected Result**: Automatic progression from Foundations → Architecture & Messages

### Agent Context Update

Running update script to add this feature to `.github/copilot-instructions.md`:

- Add technology: Stage progression logic in QuizService
- Add command: npm test (for service unit tests)
- Add recent change: 003-once-a-learning - Added automatic stage progression based on quiz scores

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

- Generate tasks from Phase 1 design (service modifications, tests, quickstart)
- Each modified service method → implementation task [P]
- Each test scenario → test creation task [P]
- Quickstart scenario → validation task

**Ordering Strategy**:

1. **T001**: Fix `LearnerService.completeStage()` bug (CRITICAL - blocks progression)
2. **T002**: Add tests for `completeStage()` unlock behavior
3. **T003**: Create `getNextStageId()` helper in QuizService
4. **T004**: Enhance `QuizService.completeQuizAttempt()` with progression logic
5. **T005**: Add comprehensive QuizService progression tests
6. **T006**: Create quickstart validation script
7. **T007**: Manual testing and edge case verification

**Estimated Output**: 7 numbered, ordered tasks in tasks.md

**Parallel Execution Opportunities**:

- T002 and T003 can run in parallel after T001
- T005 and T006 can run in parallel after T004

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)

**Phase 4**: Implementation (execute tasks.md following constitutional principles)

**Phase 5**: Validation (run tests, execute quickstart.md, verify user scenarios)

## Complexity Tracking

*No complexity violations - feature follows existing architecture exactly*

**Rationale for Simplicity**:

- Reuses 100% of existing services (QuizService, LearnerService, ContentService)
- No new data structures or types
- No UI changes (dashboard already reacts to status changes)
- <20 lines of new code total
- Fixes existing bug in `completeStage()` as bonus improvement

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning approach described (/plan command)
- [x] Phase 3: Tasks generated (/tasks command) - 7 tasks created ✓
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS ✓
- [x] Post-Design Constitution Check: PASS ✓
- [x] All NEEDS CLARIFICATION resolved ✓
- [x] Complexity deviations documented: N/A - No deviations ✓

**Task Generation Summary**:

- Total Tasks: 7
- Bug Fixes: 1 (T001 - critical completeStage bug)
- Core Implementation: 2 (T003, T004)
- Test Tasks: 2 (T002, T005)
- Validation Tasks: 2 (T006, T007)
- Estimated Time: 90 minutes
- Parallel Opportunities: T002, T003, T005 can run independently

---

*Based on Constitution v2.1.1 - See `.specify/memory/constitution.md`*
