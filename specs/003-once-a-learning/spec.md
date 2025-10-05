# Feature Specification: Stage Progression with Passing Score Requirement

**Feature Branch**: `003-once-a-learning`  
**Created**: October 5, 2025  
**Status**: Draft  
**Input**: User description: "Once a learning path is complete, I want to set its status to complete and unlock the next learning path. this should happen if there is a passing score only."

## Execution Flow (main)
```
1. Parse user description from Input
   → Feature: Automatic stage progression based on quiz passing score
2. Extract key concepts from description
   → Actors: Learner
   → Actions: Complete stage quiz, unlock next stage
   → Data: Stage status, quiz score, passing threshold
   → Constraints: Must have passing score
3. For each unclear aspect:
   → [RESOLVED] Passing score determined by existing quiz.passingThreshold
4. Fill User Scenarios & Testing section
   → User completes quiz with passing score → next stage unlocks
   → User completes quiz with failing score → next stage remains locked
5. Generate Functional Requirements
   → All requirements are testable
6. Identify Key Entities
   → Stage, Quiz, QuizAttempt, Learner
7. Run Review Checklist
   → No [NEEDS CLARIFICATION] markers
   → No implementation details in spec
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing

### Primary User Story
As a learner progressing through the MCP Learning Platform, when I complete a stage quiz with a passing score, the system should automatically mark that stage as complete and unlock the next stage in the sequence, allowing me to continue my learning journey without manual intervention.

### Acceptance Scenarios

1. **Given** a learner is on Stage 1 (Foundations) and the next stage (Architecture & Messages) is locked,  
   **When** the learner completes the Foundations quiz with a score of 75% (passing threshold is 70%),  
   **Then** the system marks Foundations as "completed" and unlocks Architecture & Messages stage (status changes from "locked" to "in-progress")

2. **Given** a learner is on Stage 1 (Foundations) and the next stage is locked,  
   **When** the learner completes the Foundations quiz with a score of 60% (below the 70% passing threshold),  
   **Then** the system keeps Foundations as "in-progress" and the next stage remains "locked"

3. **Given** a learner passes a quiz and the next stage is unlocked,  
   **When** the learner navigates to the dashboard,  
   **Then** the system displays the newly unlocked stage as accessible with visual indication

4. **Given** a learner is on the final stage (Mastery),  
   **When** the learner passes the final quiz,  
   **Then** the system marks Mastery as "completed" but does not attempt to unlock a non-existent next stage

5. **Given** a learner has failed a quiz previously,  
   **When** the learner retakes the quiz and achieves a passing score,  
   **Then** the system updates the stage to "completed" and unlocks the next stage

### Edge Cases

- **What happens when a learner retakes a quiz after passing?**  
  The stage remains "completed" and next stage remains unlocked. The system should not change existing progression status when retaking an already-passed quiz.

- **What happens if there is no next stage?**  
  The system should gracefully handle the completion of the final stage without attempting to unlock a non-existent stage. Display completion message or certificate.

- **What happens if a learner navigates away during a quiz?**  
  Quiz progress should be preserved in session storage. Stage progression only occurs upon successful quiz completion with passing score.

- **What happens when a learner has an incomplete quiz attempt?**  
  Incomplete quiz attempts should not trigger stage progression. Only completed quiz attempts with passing scores should unlock the next stage.

## Requirements

### Functional Requirements

- **FR-001**: System MUST evaluate quiz score against the stage's passing threshold immediately upon quiz completion

- **FR-002**: System MUST mark the current stage status as "completed" only when quiz score meets or exceeds the passing threshold

- **FR-003**: System MUST unlock the next sequential stage (change status from "locked" to "in-progress") only when the current stage quiz achieves a passing score

- **FR-004**: System MUST maintain the current stage status as "in-progress" when quiz score is below the passing threshold

- **FR-005**: System MUST preserve session storage data for stage statuses to persist progression within the browser session

- **FR-006**: System MUST handle the final stage completion by marking it as "completed" without attempting to unlock a non-existent next stage

- **FR-007**: System MUST display visual feedback indicating stage status changes (completed, unlocked) to the learner

- **FR-008**: System MUST allow learners to retake quizzes, with stage progression applying only on first passing attempt (subsequent retakes should not regress progression)

- **FR-009**: System MUST update the learner's progress dashboard to reflect newly completed and unlocked stages in real-time

- **FR-010**: System MUST log quiz completion and stage progression events for session analytics

### Non-Functional Requirements

- **NFR-001**: Stage progression MUST occur immediately after quiz score calculation (< 100ms delay)

- **NFR-002**: Stage status updates MUST be atomic to prevent race conditions during concurrent quiz submissions

- **NFR-003**: System MUST gracefully handle network interruptions during quiz submission without losing progression state

### Key Entities

- **Stage**: Represents a learning stage with properties including:
  - Status: "locked", "in-progress", or "completed"
  - Sequence order: Determines which stage follows
  - Quiz: Associated quiz with passing threshold

- **Quiz**: Assessment for a stage containing:
  - Questions and correct answers
  - Passing threshold: Percentage required to pass (e.g., 70%)
  - Quiz ID: Links to parent stage

- **QuizAttempt**: Record of a learner's quiz attempt including:
  - Score: Percentage achieved (0-100%)
  - Completion status: Whether quiz was fully completed
  - Timestamp: When attempt occurred
  - Pass/Fail status: Derived from score vs. threshold

- **Learner**: User progressing through stages with:
  - Stage statuses: Map of stage IDs to current status
  - Quiz attempts: History of all quiz attempts
  - Session data: Current progress stored in session storage

### Business Rules

- **BR-001**: A stage can only be marked "completed" if its quiz achieves the passing threshold
- **BR-002**: The next stage in sequence can only be unlocked when the previous stage is marked "completed"
- **BR-003**: The first stage (Foundations) is always unlocked by default ("in-progress" status)
- **BR-004**: Stage progression is irreversible - a completed stage cannot be locked again
- **BR-005**: Multiple quiz attempts are allowed, but progression occurs only on first pass
- **BR-006**: All stage progression is session-based with no persistent storage or server-side state

## Success Metrics

- **Metric 1**: 100% of learners who achieve passing scores have their next stage automatically unlocked
- **Metric 2**: 0% of learners who fail a quiz have their next stage unlocked incorrectly
- **Metric 3**: Stage status updates occur within 100ms of quiz completion
- **Metric 4**: Zero data inconsistencies between quiz scores and stage statuses

## Assumptions & Constraints

### Assumptions
- Session storage is available and functional in the learner's browser
- Quiz passing thresholds are predefined for each stage
- Stages have a clear sequential order defined by `sequenceOrder` property
- Learners complete modules before attempting the stage quiz

### Constraints
- Session-only storage means progression is lost when browser is closed
- No user authentication or persistent accounts
- Single-user, single-session design
- Cannot unlock stages out of sequence (must follow linear path)

## Out of Scope

The following are explicitly NOT part of this feature:
- Persistent storage of learner progress across sessions
- User authentication or account creation
- Server-side progress tracking or APIs
- Certificate generation or completion badges
- Email notifications of stage completion
- Social features (sharing progress, leaderboards)
- Custom learning paths or skipping stages
- Admin controls for managing stage progression
- Analytics dashboard beyond session-level tracking

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (and resolved)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed
- [x] Specification complete and ready for planning phase
