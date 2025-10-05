# Quickstart: Stage Progression with Passing Score Requirement

**Feature**: 003-once-a-learning
**Date**: October 5, 2025
**Purpose**: Manual validation of automatic stage progression when quiz is passed

## Prerequisites

- ✅ Implementation complete (all tasks in tasks.md finished)
- ✅ Unit tests passing (`npm test`)
- ✅ Development server running (`npm run dev`)

## Test Scenario 1: Passing Quiz Unlocks Next Stage

**User Story**: As a learner, when I complete a stage quiz with a passing score, the system automatically marks that stage as complete and unlocks the next stage.

### Setup

1. Open browser to `http://localhost:3000`
2. Start a new session (or clear session storage)
3. Navigate to Home page

### Steps

1. **Verify initial state**
   - Open browser DevTools → Application → Session Storage
   - Look for `mcp-learner` key
   - Verify `stageStatuses`:

     ```json
     {
       "foundations": "in-progress",
       "architecture-messages": "locked",
       "advanced-patterns": "locked",
       "building-debugging": "locked",
       "mastery": "locked"
     }
     ```

2. **Navigate to Foundations stage**
   - Click on "Foundations" stage card
   - Verify stage content loads
   - Verify quiz button is visible

3. **Start Foundations quiz**
   - Click "Take Quiz" button
   - Verify quiz page loads (`/quiz/foundations`)
   - Note: Quiz has 8 questions, 70% passing threshold (need 6/8 correct)

4. **Answer quiz questions to achieve passing score**
   - Answer at least 6 questions correctly (75% = 6/8)
   - Submit quiz

5. **Verify automatic progression**
   - Immediately after quiz completion:
     - Check session storage `mcp-learner` → `stageStatuses`
     - **Expected**:

       ```json
       {
         "foundations": "completed",
         "architecture-messages": "in-progress",
         "advanced-patterns": "locked",
         "building-debugging": "locked",
         "mastery": "locked"
       }
       ```

   - Navigate to Progress page (`/progress`)
   - **Verify**:
     - Foundations stage shows "Completed" badge
     - Architecture & Messages stage shows "In Progress" badge
     - Architecture & Messages stage is clickable/accessible

### Expected Results

- ✅ Foundations stage status changed from "in-progress" to "completed"
- ✅ Architecture & Messages stage status changed from "locked" to "in-progress"
- ✅ Other stages remain "locked"
- ✅ UI reflects status changes (badges, accessibility)
- ✅ Progression happened automatically (no manual unlock needed)

---

## Test Scenario 2: Failing Quiz Does NOT Unlock Next Stage

**User Story**: As a learner, when I complete a stage quiz with a failing score, the current stage remains in-progress and the next stage stays locked.

### Steps

1. **Start new session** (or reset session storage)
2. **Navigate to Foundations quiz** (`/quiz/foundations`)
3. **Answer quiz questions to achieve failing score**
   - Answer only 4 questions correctly (50% < 70% threshold)
   - Submit quiz

4. **Verify NO progression**
   - Check session storage `mcp-learner` → `stageStatuses`
   - **Expected**:

     ```json
     {
       "foundations": "in-progress",
       "architecture-messages": "locked",
       "advanced-patterns": "locked",
       "building-debugging": "locked",
       "mastery": "locked"
     }
     ```

   - Navigate to Progress page
   - **Verify**:
     - Foundations stage still shows "In Progress"
     - Architecture & Messages stage still shows "Locked"
     - Architecture & Messages stage is NOT accessible

### Expected Results

- ✅ Foundations stage status remains "in-progress"
- ✅ Architecture & Messages stage status remains "locked"
- ✅ No automatic progression occurred
- ✅ User can retake quiz (attempt counter incremented)

---

## Test Scenario 3: Retaking Quiz After Passing

**User Story**: As a learner, when I retake a quiz that I've already passed, the system maintains my completed status and doesn't regress progression.

### Steps

1. **Complete Foundations quiz with passing score** (see Scenario 1)
   - Verify Foundations is "completed"
   - Verify Architecture & Messages is "in-progress"

2. **Retake Foundations quiz**
   - Navigate back to `/quiz/foundations`
   - Answer questions again (any score)
   - Submit quiz

3. **Verify progression unchanged**
   - Check session storage `mcp-learner` → `stageStatuses`
   - **Expected** (same as after first pass):

     ```json
     {
       "foundations": "completed",
       "architecture-messages": "in-progress",
       ...
     }
     ```

### Expected Results

- ✅ Foundations status remains "completed" (doesn't revert)
- ✅ Architecture & Messages status remains "in-progress" (doesn't lock again)
- ✅ Retaking quiz doesn't break progression
- ✅ Quiz attempt counter increments

---

## Test Scenario 4: Final Stage Completion (Mastery)

**User Story**: As a learner, when I complete the final stage quiz (Mastery), the system marks it as completed without attempting to unlock a non-existent next stage.

### Setup

**NOTE**: This requires completing all previous stages first. For quick testing, you can manually set stage statuses in session storage:

```javascript
// In browser console
const learner = JSON.parse(sessionStorage.getItem('mcp-learner'));
learner.stageStatuses = {
  'foundations': 'completed',
  'architecture-messages': 'completed',
  'advanced-patterns': 'completed',
  'building-debugging': 'completed',
  'mastery': 'in-progress'
};
sessionStorage.setItem('mcp-learner', JSON.stringify(learner));
```

### Steps

1. **Navigate to Mastery quiz** (`/quiz/mastery`)
2. **Complete quiz with passing score**
   - Answer questions to achieve ≥70%
   - Submit quiz

3. **Verify final stage completion**
   - Check session storage `mcp-learner` → `stageStatuses`
   - **Expected**:

     ```json
     {
       "foundations": "completed",
       "architecture-messages": "completed",
       "advanced-patterns": "completed",
       "building-debugging": "completed",
       "mastery": "completed"
     }
     ```

   - **Verify**: No errors in browser console
   - Navigate to Progress page
   - **Verify**: All stages show "Completed"

### Expected Results

- ✅ Mastery stage status changed to "completed"
- ✅ No error when there's no next stage to unlock
- ✅ No undefined stage status set
- ✅ UI displays completion message or certificate (if implemented)

---

## Test Scenario 5: Multi-Stage Progression

**User Story**: As a learner, I can progress through multiple stages sequentially by passing each quiz.

### Steps

1. **Start fresh session**
2. **Complete Foundations quiz** (pass) → verify unlock Architecture & Messages
3. **Complete Architecture & Messages quiz** (pass) → verify unlock Advanced Patterns
4. **Complete Advanced Patterns quiz** (pass) → verify unlock Building & Debugging
5. **Complete Building & Debugging quiz** (pass) → verify unlock Mastery
6. **Complete Mastery quiz** (pass) → verify all completed

### Expected Results

- ✅ Linear progression through all 5 stages
- ✅ Each quiz pass unlocks exactly the next stage in sequence
- ✅ Progress page accurately reflects stage statuses
- ✅ No stages skip ahead or unlock out of order

---

## Browser Console Validation

### Useful Console Commands

```javascript
// Check current learner state
const learner = JSON.parse(sessionStorage.getItem('mcp-learner'));
console.table(learner.stageStatuses);

// Check quiz attempts
console.log('Quiz attempts:', learner.quizAttempts);

// Check quiz counters
console.table(learner.sessionCounters.quizAttempts);
console.table(learner.sessionCounters.quizPasses);

// Reset session (start fresh)
sessionStorage.clear();
location.reload();
```

---

## Performance Validation

### Timing Test

1. Open browser DevTools → Performance tab
2. Start recording
3. Complete a quiz (trigger progression)
4. Stop recording
5. **Verify**: Total progression time (quiz submit → stage status update) < 100ms

### Expected Performance

- ✅ Quiz completion: <50ms
- ✅ Stage status update: <10ms
- ✅ SessionStorage write: <10ms
- ✅ UI re-render: <30ms
- ✅ **Total**: <100ms (meets NFR-001)

---

## Error Scenarios (Should NOT Happen)

### Test: What if ContentService fails?

1. Temporarily break `ContentService.getAllStages()` (return empty array)
2. Complete quiz
3. **Expected**: Graceful error handling (no crash), progression skipped

### Test: What if next stage already in-progress?

1. Manually set next stage to "in-progress" before quiz
2. Pass quiz
3. **Expected**: No error, stage remains "in-progress" (idempotent)

---

## Acceptance Criteria Checklist

From spec.md acceptance scenarios:

- [ ] **Scenario 1**: Passing quiz (75%) unlocks next stage ✅
- [ ] **Scenario 2**: Failing quiz (60%) keeps next stage locked ✅
- [ ] **Scenario 3**: Dashboard shows newly unlocked stage ✅
- [ ] **Scenario 4**: Final stage completes without error ✅
- [ ] **Scenario 5**: Retake after pass works correctly ✅

**Additional Validations**:

- [ ] No console errors during progression
- [ ] SessionStorage updated correctly
- [ ] UI reflects status changes immediately
- [ ] Performance <100ms
- [ ] Works across all 5 stages
- [ ] Quiz attempt counters accurate

---

## Rollback Plan

If critical issues found during validation:

1. **Revert changes**: `git revert <commit-hash>`
2. **Hotfix branch**: `git checkout -b hotfix/003-once-a-learning`
3. **Fix and re-test**: Address issues, run quickstart again
4. **Merge when stable**: Only merge after all scenarios pass

---

## Sign-Off

**Validated By**: _________________  
**Date**: _________________  
**Status**: [ ] PASS  [ ] FAIL  
**Notes**:

---

*Quickstart validation complete. Feature ready for production if all scenarios pass.*
