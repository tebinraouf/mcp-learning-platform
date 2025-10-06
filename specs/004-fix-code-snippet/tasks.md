# Tasks: UI Fixes - Code Snippets, Knowledge Map Progress, and Time Tracking

**Feature**: 004-fix-code-snippet  
**Branch**: `004-fix-code-snippet`  
**Input**: Design documents from `/specs/004-fix-code-snippet/`  
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → Extract: TypeScript 5.7, React 18.3.0, Next.js 15.5.4, Tailwind CSS
   → Structure: Web (frontend only, no backend)
2. Load design documents:
   → research.md: Tailwind CSS for styling, simple mastery formula, sessionStorage for time
   → data-model.md: No schema changes, sessionStartTime key added
   → quickstart.md: 3 test scenarios (code snippets, mastery, time tracking)
3. Generate tasks by category:
   → Setup: None needed (existing project)
   → Tests: TDD for utility functions (mastery, duration, timestamp)
   → Core: Component updates (MarkdownRenderer, KnowledgeMap, LearnerService, Progress page)
   → Integration: Manual test scenarios from quickstart.md
   → Polish: Accessibility, performance, cross-browser validation
4. Apply task rules:
   → Wave 1 [P]: T001, T003, T007, T008 (different files, no dependencies)
   → Wave 2 [P]: T002, T004, T009 (depends on Wave 1)
   → Wave 3 [P]: T005, T010 (depends on Wave 2)
   → Wave 4: T006 (depends on T005)
   → Wave 5: T011-T014 (sequential validation)
5. Number tasks sequentially (T001-T014)
6. Validate completeness: All 9 FR covered, all test scenarios included
7. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions
- TDD tasks: Write tests FIRST, then implementation

## Path Conventions

This is a **Web (frontend only)** project with Next.js static export:

- Components: `src/components/`
- Pages: `src/app/`
- Services: `src/services/`
- Types: `src/types/`
- Tests: `src/services/__tests__/`, `src/components/__tests__/`
- Utils: `src/utils/` or `src/lib/`

## Phase 3.1: Wave 1 - Parallel Foundation Tasks

**CRITICAL: These tasks can run in parallel (different files, no shared dependencies)**

### T001 [P] Update MarkdownRenderer.tsx with code block styling

**File**: `src/components/MarkdownRenderer.tsx`

**Objective**: Improve code snippet readability with Tailwind CSS utilities (FR-001, FR-002, FR-003)

**Implementation**:

1. Locate the component rendering code blocks (likely uses `react-markdown`)
2. Add wrapper div with className `markdown-content` if not already present
3. Add CSS classes for code blocks:

   ```tsx
   // Light mode
   className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed"
   
   // Dark mode (add dark: variants)
   className="... dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
   ```

4. Add CSS classes for inline code:

   ```tsx
   // Light mode
   className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded font-mono text-sm"
   
   // Dark mode
   className="... dark:bg-gray-800 dark:text-gray-100"
   ```

5. Ensure horizontal scrolling for long code lines (`overflow-x-auto`)

**Acceptance**:

- Code blocks have visible background color in light mode
- Code blocks have visible background color in dark mode
- Inline code is visually distinct from paragraph text
- No layout shifts or broken markdown rendering

**Reference**: research.md Section 1 (Code Block Syntax Highlighting Best Practices)

---

### T003 [P] Create calculateMastery() utility function with tests [TDD]

**Files**:

- `src/utils/mastery.ts` (new file for utility)
- `src/utils/__tests__/mastery.test.ts` (new file for tests)

**Objective**: Calculate mastery percentage from SessionCounters (FR-005)

**Test Cases** (write FIRST):

```typescript
describe('calculateMastery', () => {
  it('returns 0 when no questions answered (division by zero)', () => {
    const counters = {
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      // ... other fields
    };
    expect(calculateMastery(counters)).toBe(0);
  });

  it('calculates accuracy percentage correctly', () => {
    const counters = {
      totalQuestionsAnswered: 10,
      totalCorrectAnswers: 8,
      // ... other fields
    };
    expect(calculateMastery(counters)).toBe(80);
  });

  it('rounds to whole number', () => {
    const counters = {
      totalQuestionsAnswered: 3,
      totalCorrectAnswers: 2,
      // ... other fields
    };
    expect(calculateMastery(counters)).toBe(67); // 66.666... → 67
  });

  it('handles 100% accuracy', () => {
    const counters = {
      totalQuestionsAnswered: 5,
      totalCorrectAnswers: 5,
      // ... other fields
    };
    expect(calculateMastery(counters)).toBe(100);
  });

  it('handles 0% accuracy', () => {
    const counters = {
      totalQuestionsAnswered: 5,
      totalCorrectAnswers: 0,
      // ... other fields
    };
    expect(calculateMastery(counters)).toBe(0);
  });
});
```

**Implementation** (after tests fail):

```typescript
import { SessionCounters } from '@/types';

export function calculateMastery(counters: SessionCounters): number {
  if (counters.totalQuestionsAnswered === 0) return 0;
  
  const accuracy = (counters.totalCorrectAnswers / counters.totalQuestionsAnswered) * 100;
  return Math.round(accuracy);
}
```

**Acceptance**:

- All 5 test cases pass
- Function handles division by zero gracefully
- Returns whole number percentage (0-100)

**Reference**: research.md Section 2 (Mastery Level Calculation Patterns)

---

### T007 [P] Add sessionStartTime initialization logic [TDD]

**Files**:

- `src/app/layout.tsx` (modify existing root layout)
- `src/app/layout.test.tsx` (new file for tests) OR use E2E test

**Objective**: Initialize session start timestamp on first app load (FR-008)

**Implementation** (in `layout.tsx` client component or separate hook):

```typescript
'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize session start time if not already set
    if (typeof window !== 'undefined' && !sessionStorage.getItem('sessionStartTime')) {
      sessionStorage.setItem('sessionStartTime', Date.now().toString());
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Test Strategy** (if unit testing):

- Mock `sessionStorage` and `Date.now()`
- Verify `setItem` called with current timestamp when key doesn't exist
- Verify `setItem` NOT called when key already exists

**Alternative**: Manual test via quickstart.md Test Scenario 3, Step 1

**Acceptance**:

- On first app load, `sessionStartTime` is set in sessionStorage
- On subsequent loads, existing `sessionStartTime` is preserved
- Timestamp is valid number (parseable)

**Reference**: research.md Section 3 (Session Time Tracking Patterns)

---

### T008 [P] Create formatDuration() utility function with tests [TDD]

**Files**:

- `src/utils/time.ts` (new file for utility)
- `src/utils/__tests__/time.test.ts` (new file for tests)

**Objective**: Format duration in milliseconds to human-readable string (FR-009)

**Test Cases** (write FIRST):

```typescript
describe('formatDuration', () => {
  it('formats duration < 1 minute as seconds', () => {
    expect(formatDuration(5000)).toBe('5s');
    expect(formatDuration(45000)).toBe('45s');
  });

  it('formats duration 1-60 minutes as minutes and seconds', () => {
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(180000)).toBe('3m 0s');
    expect(formatDuration(125000)).toBe('2m 5s');
  });

  it('formats duration > 60 minutes as hours and minutes (no seconds)', () => {
    expect(formatDuration(3600000)).toBe('1h 0m');
    expect(formatDuration(5400000)).toBe('1h 30m');
    expect(formatDuration(7200000)).toBe('2h 0m');
  });

  it('handles 0 milliseconds', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('handles negative values gracefully', () => {
    expect(formatDuration(-1000)).toBe('0s'); // or throw error
  });
});
```

**Implementation** (after tests fail):

```typescript
export function formatDuration(ms: number): string {
  if (ms <= 0) return '0s';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  return `${seconds}s`;
}
```

**Acceptance**:

- All 5 test cases pass
- Human-readable format for all time ranges
- Handles edge cases (0, negative)

**Reference**: research.md Section 3 (Session Time Tracking Patterns)

---

## Phase 3.2: Wave 2 - Dependent Tasks

**Dependencies**: Wave 1 must be complete (T001, T003, T007, T008)

### T002 [P] Test code snippet rendering across markdown content

**File**: Manual testing via browser (reference: quickstart.md Test Scenario 1)

**Objective**: Validate code block styling in light and dark modes (FR-001, FR-002, FR-003)

**Steps**:

1. Start dev server: `npm run dev`
2. Navigate to a stage with code examples (e.g., "Introduction to MCP")
3. Follow quickstart.md Test Scenario 1, Steps 2-5:
   - Verify light mode code blocks (contrast, padding, borders)
   - Switch to dark mode and verify dark styling
   - Check inline code rendering
   - Use DevTools to verify contrast ratio ≥4.5:1
4. Document any issues in task notes

**Acceptance**:

- [ ] Light mode code blocks readable (4.5:1 contrast)
- [ ] Dark mode code blocks readable (4.5:1 contrast)
- [ ] Inline code visually distinct
- [ ] No regressions to other markdown elements

**Depends on**: T001

---

### T004 [P] Create getMasteryLevel() classification function with tests [TDD]

**Files**:

- `src/utils/mastery.ts` (add to existing file)
- `src/utils/__tests__/mastery.test.ts` (add to existing file)

**Objective**: Classify mastery percentage into levels (FR-006)

**Test Cases** (write FIRST):

```typescript
describe('getMasteryLevel', () => {
  it('returns "Beginner" for 0-40%', () => {
    expect(getMasteryLevel(0)).toBe('Beginner');
    expect(getMasteryLevel(25)).toBe('Beginner');
    expect(getMasteryLevel(40)).toBe('Beginner');
  });

  it('returns "Intermediate" for 41-70%', () => {
    expect(getMasteryLevel(41)).toBe('Intermediate');
    expect(getMasteryLevel(55)).toBe('Intermediate');
    expect(getMasteryLevel(70)).toBe('Intermediate');
  });

  it('returns "Advanced" for 71-89%', () => {
    expect(getMasteryLevel(71)).toBe('Advanced');
    expect(getMasteryLevel(80)).toBe('Advanced');
    expect(getMasteryLevel(89)).toBe('Advanced');
  });

  it('returns "Master" for 90-100%', () => {
    expect(getMasteryLevel(90)).toBe('Master');
    expect(getMasteryLevel(95)).toBe('Master');
    expect(getMasteryLevel(100)).toBe('Master');
  });
});
```

**Implementation** (after tests fail):

```typescript
export type MasteryLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';

export function getMasteryLevel(percentage: number): MasteryLevel {
  if (percentage <= 40) return 'Beginner';
  if (percentage <= 70) return 'Intermediate';
  if (percentage <= 89) return 'Advanced';
  return 'Master';
}
```

**Acceptance**:

- All 4 test cases pass
- Correct classification for boundary values

**Reference**: research.md Section 2 (Mastery Level Classification)

**Depends on**: T003 (uses same file, but logically separate)

---

### T009 [P] Update LearnerService.ts time tracking logic

**File**: `src/services/LearnerService.ts`

**Objective**: Fix session duration calculation to use sessionStorage timestamp (FR-008, FR-009)

**Implementation**:

1. Locate the time tracking logic (likely in `getCurrentProgress()` method, around lines 167-198)
2. Replace hardcoded timestamp logic with sessionStorage read:

   ```typescript
   // OLD (buggy):
   const sessionStart = new Date().getTime(); // Always current time
   const sessionEnd = new Date().getTime();
   const duration = sessionEnd - sessionStart; // Always ~0ms
   
   // NEW (fixed):
   const sessionStartTime = parseInt(
     sessionStorage.getItem('sessionStartTime') || Date.now().toString(),
     10
   );
   const currentTime = Date.now();
   const durationMs = currentTime - sessionStartTime;
   ```

3. Import and use `formatDuration()` utility:

   ```typescript
   import { formatDuration } from '@/utils/time';
   
   const formattedDuration = formatDuration(durationMs);
   ```

4. Update return value to include formatted duration

**Test Strategy**:

- Update existing `LearnerService.test.ts` with new test case for time tracking
- Mock `sessionStorage.getItem()` and `Date.now()`
- Verify duration calculation uses session start timestamp

**Acceptance**:

- Duration calculated from sessionStartTime (not current time)
- Missing timestamp handled gracefully (defaults to Date.now())
- Formatted duration returned

**Reference**: research.md Section 3, data-model.md (sessionStartTime schema)

**Depends on**: T007, T008

---

## Phase 3.3: Wave 3 - Component Integration

**Dependencies**: Wave 2 must be complete (T002, T004, T009)

### T005 [P] Update KnowledgeMap.tsx to display mastery badges

**File**: `src/components/KnowledgeMap.tsx`

**Objective**: Add mastery calculation and color-coded badges to concept nodes (FR-006, FR-007)

**Implementation**:

1. Import utility functions:

   ```typescript
   import { calculateMastery, getMasteryLevel } from '@/utils/mastery';
   ```

2. Get SessionCounters from props or context (via LearnerService)
3. Add `useMemo` to calculate mastery for all concepts:

   ```typescript
   const masteryData = useMemo(() => {
     const counters = learnerService.getCurrentProgress().counters;
     const masteryPercentage = calculateMastery(counters);
     const masteryLevel = getMasteryLevel(masteryPercentage);
     return { percentage: masteryPercentage, level: masteryLevel };
   }, [/* dependencies: sessionCounters */]);
   ```

4. Render mastery badge with color coding:

   ```typescript
   // Color mapping (WCAG AA compliant from research.md)
   const badgeColors = {
     Beginner: 'bg-red-100 text-red-900',
     Intermediate: 'bg-yellow-100 text-yellow-900',
     Advanced: 'bg-green-100 text-green-900',
     Master: 'bg-green-200 text-green-950',
   };
   
   <span className={`${badgeColors[masteryData.level]} px-2 py-1 rounded text-sm font-medium`}>
     {masteryData.percentage}% {masteryData.level}
   </span>
   ```

5. Apply mastery-based border colors to concept nodes (FR-007)

**Acceptance**:

- Mastery badge displays percentage and level
- 4 mastery levels have distinct colors (red/yellow/light green/dark green)
- Color contrast ≥4.5:1 (verify with DevTools)
- `useMemo` prevents unnecessary recalculations

**Reference**: research.md Section 2 (Color Accessibility), Section 5 (Performance Optimization)

**Depends on**: T003, T004

---

### T010 [P] Update Progress page to display session time

**File**: `src/app/progress/page.tsx` (or wherever progress is displayed)

**Objective**: Display formatted session duration in progress UI (FR-009)

**Implementation**:

1. Import `LearnerService` if not already imported
2. Get current progress data:

   ```typescript
   const progress = learnerService.getCurrentProgress();
   ```

3. Extract formatted duration (LearnerService now returns it after T009)
4. Display in header or stats section:

   ```typescript
   <div className="text-sm text-gray-600 dark:text-gray-400">
     Time spent: {progress.sessionDuration}
   </div>
   ```

5. Ensure component re-renders on navigation/reload to show updated time

**Acceptance**:

- Session duration displays in human-readable format
- Duration updates on page reload
- Format matches spec: "Xs", "Xm Ys", or "Xh Ym"

**Reference**: quickstart.md Test Scenario 3

**Depends on**: T009

---

## Phase 3.4: Wave 4 - Integration Testing

**Dependencies**: Wave 3 must be complete (T005, T010)

### T006 Update knowledge map page to integrate mastery display

**File**: `src/app/knowledge-map/page.tsx`

**Objective**: Wire up LearnerService to KnowledgeMap component (FR-004)

**Implementation**:

1. Ensure `LearnerService.getCurrentProgress()` is called and passed to `KnowledgeMap` component
2. Verify SessionCounters are reactive (update after quiz completion)
3. Add performance monitoring (optional):

   ```typescript
   const start = performance.now();
   // ... mastery calculations
   const end = performance.now();
   console.log(`Mastery calculation took ${end - start}ms`);
   ```

4. Test with 20+ concepts to verify <100ms performance (NFR-002)

**Manual Test** (quickstart.md Test Scenario 2):

1. Open browser in incognito mode
2. Complete quizzes with varying accuracy (40%, 60%, 80%, 95%)
3. Return to knowledge map after each quiz
4. Verify mastery badge updates correctly
5. Verify colors change based on performance
6. Use DevTools Performance tab to profile mastery calculation (<100ms)

**Acceptance**:

- [ ] Mastery levels update after quiz completion
- [ ] Performance <100ms for 20+ concepts
- [ ] All scenarios from quickstart.md Test Scenario 2 pass
- [ ] No errors in console

**Depends on**: T005

---

## Phase 3.5: Wave 5 - Validation (Sequential)

**Dependencies**: All implementation tasks complete (T001-T010)

### T011 Run regression tests (manual from quickstart.md)

**File**: Manual testing via browser (reference: quickstart.md Regression Testing section)

**Objective**: Ensure no existing features are broken (NFR-003)

**Test Areas**:

1. **Quiz Functionality**: Complete quiz end-to-end
   - Submit answers, view results, verify scoring
   - Check SessionCounters update correctly
2. **Stage Navigation**: Navigate between stages
   - Verify unlocking logic works
   - Check content displays correctly
3. **Knowledge Map Graph**: View knowledge map with prerequisites
   - Verify graph layout unchanged
   - Check edges and connections intact
4. **Markdown Rendering (Non-Code)**: View stage with various markdown elements
   - Headers, lists, links, images, tables
   - Ensure no styling regressions

**Acceptance**:

- [ ] Quiz functionality unchanged
- [ ] Stage navigation unchanged
- [ ] Knowledge map graph layout unchanged
- [ ] Markdown rendering (non-code) unchanged
- No functional regressions detected

**Reference**: quickstart.md Regression Testing section

**Depends on**: All implementation tasks (T001-T010)

---

### T012 Run accessibility validation

**File**: Manual testing via browser DevTools

**Objective**: Verify WCAG AA compliance maintained (NFR-004)

**Tools**:

- Chrome DevTools Lighthouse (Accessibility audit)
- axe DevTools extension (optional)

**Steps**:

1. Run Lighthouse audit on all pages:
   - Home (`/`)
   - Knowledge Map (`/knowledge-map`)
   - Stage pages (`/stage/*`)
   - Quiz pages (`/quiz/*`)
   - Progress page (`/progress`)
2. Focus on new elements:
   - Code block contrast (≥4.5:1)
   - Mastery badge contrast (≥4.5:1)
   - Keyboard navigation (no impact expected)
3. Document any issues and fix before proceeding

**Acceptance**:

- [ ] Lighthouse accessibility score ≥90 (or no regressions from baseline)
- [ ] Code block contrast ≥4.5:1 (light and dark mode)
- [ ] Mastery badge contrast ≥4.5:1 (all 4 levels)
- [ ] No new keyboard navigation issues
- No new accessibility errors introduced

**Reference**: quickstart.md Accessibility Validation section

**Depends on**: T011

---

### T013 Run performance validation

**File**: Manual testing via browser DevTools

**Objective**: Verify performance budgets maintained (NFR-001, NFR-002)

**Tools**:

- Chrome DevTools Lighthouse (Performance audit)
- Chrome DevTools Performance tab

**Steps**:

1. Run Lighthouse performance audit on all pages
2. Verify performance budgets (from constitution):
   - LCP (Largest Contentful Paint) ≤2.0s
   - CLS (Cumulative Layout Shift) ≤0.1
   - TBT (Total Blocking Time) ≤200ms
3. Profile mastery calculation timing:
   - Open Performance tab
   - Record Knowledge Map page load
   - Verify mastery calculation completes in <100ms (NFR-002)
4. Check bundle size hasn't increased (no new dependencies)

**Acceptance**:

- [ ] LCP ≤2.0s
- [ ] CLS ≤0.1
- [ ] TBT ≤200ms
- [ ] Mastery calculation <100ms for 20+ concepts
- [ ] No bundle size increase
- Performance budgets maintained

**Reference**: plan.md Constitution Check (Performance Budget Compliance)

**Depends on**: T012

---

### T014 Cross-browser testing

**File**: Manual testing across browsers

**Objective**: Ensure consistent behavior across browsers (NFR-003)

**Browsers**:

- Chrome (latest)
- Firefox (latest)
- Safari (latest, macOS)
- Edge (latest)

**Test Scenarios** (abbreviated from quickstart.md):

1. Code snippet rendering (light/dark mode)
2. Mastery badge display and colors
3. Session time tracking and formatting
4. Overall UI consistency

**Steps**:

1. For each browser:
   - Run dev server: `npm run dev`
   - Execute key test scenarios from quickstart.md
   - Document any browser-specific issues
2. Focus on CSS/Tailwind rendering (most likely source of differences)

**Acceptance**:

- [ ] Chrome: All test scenarios pass
- [ ] Firefox: All test scenarios pass
- [ ] Safari: All test scenarios pass
- [ ] Edge: All test scenarios pass
- Consistent behavior across all browsers

**Reference**: quickstart.md Browser Compatibility section

**Depends on**: T013

---

## Dependencies Graph

```
Phase 3.1 (Wave 1) - Parallel:
T001 [P] ────────────────┐
T003 [P] ────┬───────┐   │
T007 [P] ──┐ │       │   │
T008 [P] ──┼─┘       │   │
           │         │   │
Phase 3.2 (Wave 2) - Parallel:
           │         │   │
T002 [P] ◄─┼─────────┼───┘
T004 [P] ◄─┘         │
T009 [P] ◄───────────┘
           │
Phase 3.3 (Wave 3) - Parallel:
           │
T005 [P] ◄─┴─────┐
T010 [P] ◄───────┤
                 │
Phase 3.4 (Wave 4) - Sequential:
                 │
T006 ◄───────────┘
  │
Phase 3.5 (Wave 5) - Sequential:
  │
T011 ◄─┘
  │
T012 ◄─┘
  │
T013 ◄─┘
  │
T014 ◄─┘
```

## Parallel Execution Examples

### Wave 1: Foundation (4 tasks in parallel)

```bash
# All can run simultaneously (different files, no dependencies)
Task: "Update MarkdownRenderer.tsx with code block styling"
Task: "Create calculateMastery() utility function with tests [TDD]"
Task: "Add sessionStartTime initialization logic [TDD]"
Task: "Create formatDuration() utility function with tests [TDD]"
```

### Wave 2: Dependent Tasks (3 tasks in parallel)

```bash
# After Wave 1 complete
Task: "Test code snippet rendering across markdown content"
Task: "Create getMasteryLevel() classification function with tests [TDD]"
Task: "Update LearnerService.ts time tracking logic"
```

### Wave 3: Component Integration (2 tasks in parallel)

```bash
# After Wave 2 complete
Task: "Update KnowledgeMap.tsx to display mastery badges"
Task: "Update Progress page to display session time"
```

### Wave 4: Integration Testing (1 task)

```bash
# After Wave 3 complete
Task: "Update knowledge map page to integrate mastery display"
```

### Wave 5: Validation (4 tasks sequential)

```bash
# After all implementation complete
Task: "Run regression tests (manual from quickstart.md)"
# Then:
Task: "Run accessibility validation"
# Then:
Task: "Run performance validation"
# Then:
Task: "Cross-browser testing"
```

## Notes

- **TDD Tasks**: T003, T004, T007, T008 - Write tests FIRST, then implementation
- **Manual Testing**: T002, T006, T011-T014 - Use quickstart.md as guide
- **Performance Critical**: T006 must verify <100ms mastery calculation (NFR-002)
- **Accessibility Critical**: T012 must verify ≥4.5:1 contrast for all new elements (NFR-004)
- **No New Dependencies**: All tasks use existing libraries (Tailwind, react-markdown)
- **No Data Model Changes**: All tasks work with existing types and storage

## Validation Checklist

*GATE: All checks must pass before considering feature complete*

- [x] All 9 functional requirements (FR-001 to FR-009) have corresponding tasks
- [x] All 4 non-functional requirements (NFR-001 to NFR-004) validated in T011-T014
- [x] All test scenarios from quickstart.md covered (3 scenarios)
- [x] TDD tasks have tests before implementation (T003, T004, T007, T008)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task in same wave
- [x] Dependencies graph is acyclic and correct
- [x] Performance budgets validated (T013)
- [x] Accessibility standards validated (T012)

## Estimated Complexity

**Total Tasks**: 14

- **Wave 1**: 4 tasks (parallel) - ~2 hours
- **Wave 2**: 3 tasks (parallel) - ~1.5 hours
- **Wave 3**: 2 tasks (parallel) - ~1 hour
- **Wave 4**: 1 task - ~0.5 hours
- **Wave 5**: 4 tasks (sequential) - ~1 hour

**Total Estimated Duration**: ~6 hours (aligned with spec.md estimate)

**Complexity Level**: Low-Medium

- No new dependencies
- No data model changes
- Minimal code changes (CSS, calculations, UI display)
- Well-defined requirements with clear acceptance criteria

---

*Generated from plan.md Phase 2 task breakdown - Ready for execution*
