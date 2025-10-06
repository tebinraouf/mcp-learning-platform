# Feature Specification: UI Fixes - Code Snippets, Knowledge Map Progress, and Time Tracking

**Feature Branch**: `004-fix-code-snippet`  
**Created**: October 5, 2025  
**Status**: Draft  
**Input**: User description: "fix code snippet preview where it is not readable. I want these to be visible nicely. The knowledge map doesn't show any progress. Timespent is not calculated properly"

## Execution Flow (main)

```
1. Parse user description from Input
   → Identified 3 distinct issues: code readability, knowledge map progress, time tracking
2. Extract key concepts from description
   → Actors: learners viewing content
   → Actions: reading code snippets, viewing knowledge map, tracking time
   → Data: code formatting, mastery levels, session duration
   → Constraints: session-based tracking, existing UI components
3. Fill User Scenarios & Testing section
   → All scenarios clearly defined
4. Generate Functional Requirements
   → 9 functional requirements covering all 3 issues
5. Identify Key Entities
   → No new entities needed (using existing data structures)
6. Review Checklist
   → All checks passed
7. Return: SUCCESS (spec ready for planning)
```

---

## User Scenarios & Testing

### Primary User Story 1: Readable Code Snippets

As a learner, when I view module content containing code examples, I want the code to be clearly visible with proper formatting and contrast so that I can easily read and understand the syntax.

### Primary User Story 2: Knowledge Map Progress Visualization

As a learner, when I visit the knowledge map page, I want to see visual indicators of my mastery level for each concept based on my quiz performance, so I can identify which areas I've mastered and which need review.

### Primary User Story 3: Accurate Time Tracking

As a learner, when I view my progress dashboard, I want to see accurate time spent in the current session, calculated properly from when I started, so I can track my learning investment.

### Acceptance Scenarios

**Code Snippet Display**:

1. **Given** a learner is viewing a module with code examples, **When** they scroll to code blocks, **Then** code text should be clearly readable with sufficient color contrast against the background
2. **Given** a code snippet is in dark mode, **When** displayed, **Then** syntax should maintain readability with appropriate dark mode styling
3. **Given** inline code snippets exist in paragraphs, **When** rendered, **Then** they should be visually distinct from regular text

**Knowledge Map Progress**:

1. **Given** a learner has passed quizzes with varying scores, **When** viewing the knowledge map, **Then** concepts should display color-coded mastery levels (green ≥80%, yellow ≥50%, red <50%)
2. **Given** a learner hasn't studied certain concepts, **When** viewing the knowledge map, **Then** unstudied concepts should display as "Not studied" or 0% mastery
3. **Given** a learner has strong performance in specific concepts, **When** viewing the knowledge map, **Then** those concepts should show higher mastery levels with visual progress bars

**Time Tracking**:

1. **Given** a learner starts a new session, **When** the session starts, **Then** a session start timestamp should be recorded in session storage
2. **Given** a learner has been active for 15 minutes, **When** viewing progress page, **Then** "Time Spent" should display "15m"
3. **Given** session duration counter updates, **When** page refreshes, **Then** time calculation should be based on the difference between current time and session start timestamp

### Edge Cases

- What happens when code snippets contain special characters or very long lines? → Should handle overflow with horizontal scrolling
- How does the system handle concepts with no related quiz questions? → Should display as "Not studied" or 0% mastery
- What happens if session start timestamp is missing or corrupted? → Should default to 0 minutes and reinitialize timestamp
- How does the system handle dark mode transitions for code blocks? → Should update styling reactively based on theme

---

## Requirements

### Functional Requirements

**Code Snippet Readability** (Issue 1):

- **FR-001**: System MUST render code blocks with high contrast text colors visible in both light and dark modes
- **FR-002**: Inline code snippets MUST be styled with distinct background color and appropriate padding to differentiate from regular text
- **FR-003**: Multi-line code blocks MUST display with proper background styling, padding, and border to enhance readability

**Knowledge Map Progress Visualization** (Issue 2):

- **FR-004**: System MUST calculate mastery level for each concept based on learner's quiz performance in related topics
- **FR-005**: System MUST display mastery levels visually using color-coding (green for strong, yellow for moderate, red for weak/unstudied)
- **FR-006**: Knowledge map MUST show progress bars or percentage indicators for each concept's mastery level
- **FR-007**: System MUST handle concepts with no quiz data by displaying "Not studied" or 0% mastery

**Time Tracking Accuracy** (Issue 3):

- **FR-008**: System MUST record session start timestamp when learner first initializes their profile
- **FR-009**: System MUST calculate session duration as the difference between current time and session start timestamp (in minutes)

### Non-Functional Requirements

- **NFR-001**: Code snippet styling changes MUST not impact performance or page load times
- **NFR-002**: Mastery calculations MUST complete within 100ms to avoid UI lag
- **NFR-003**: Time tracking MUST update dynamically without requiring page refresh
- **NFR-004**: All visual changes MUST maintain WCAG AA accessibility standards

### Key Entities

**ConceptNode** (from knowledge map):

- Represents a concept with mastery level
- Attributes: id, name, category, mastery (0-1 decimal), relatedConcepts
- Used by: KnowledgeMap component

**SessionCounters** (from learner profile):

- Tracks session metrics including duration
- Attributes: sessionDuration (milliseconds), quizPasses, quizAttempts, etc.
- Used by: LearnerService, AnalyticsService

**Learner** (session profile):

- Main learner data structure
- Includes: sessionId, stageStatuses, quizAttempts, moduleCompletions, sessionCounters
- Persisted in: SessionStorage

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
- [x] Ambiguities marked (none found)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Dependencies & Assumptions

**Dependencies**:

- Existing `MarkdownRenderer` component handles code block rendering
- Existing `KnowledgeMap` component displays concepts
- Existing `LearnerService` manages session tracking
- Existing `StorageService` persists session data

**Assumptions**:

- Session-based storage is already functional
- Quiz performance data is available for mastery calculations
- Components are already responsive and accessible
- Dark mode theming system is already implemented

**No Breaking Changes**:

- All fixes are visual/calculation improvements
- No data model changes required
- No new dependencies needed
- Existing functionality preserved

---

## Success Criteria

**Feature is complete when**:

1. ✅ Code snippets are clearly readable in both light and dark modes
2. ✅ Knowledge map displays accurate mastery levels based on quiz performance
3. ✅ Time spent calculation shows accurate session duration from start timestamp
4. ✅ All visual changes maintain accessibility standards
5. ✅ No regression in existing functionality
6. ✅ All test scenarios pass manual validation

**User Acceptance**:

- Learners can easily read code examples without straining
- Learners can identify their strong and weak concept areas visually
- Learners see accurate time tracking on progress page
- UI updates feel seamless and performant
