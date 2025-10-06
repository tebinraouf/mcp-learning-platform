# Quickstart Guide: Manual Testing for Feature 004

**Feature**: UI Fixes - Code Snippets, Knowledge Map Progress, and Time Tracking  
**Branch**: 004-fix-code-snippet  
**Date**: October 5, 2025

## Prerequisites

- ✅ Development environment running (`npm run dev`)
- ✅ Browser with DevTools (Chrome/Firefox recommended)
- ✅ Feature 004 implementation complete
- ✅ No console errors on page load

## Testing Scenarios

### Test Scenario 1: Code Snippet Readability (FR-001, FR-002, FR-003)

**Objective**: Verify code blocks have clear contrast in both light and dark modes.

**Steps**:

1. **Navigate to Stage with Code Examples**:
   - Open browser to `http://localhost:3000`
   - Click on Knowledge Map
   - Select a stage that contains markdown with code blocks (e.g., "Introduction to MCP")
   - Click "View Content"

2. **Verify Light Mode Readability**:
   - Ensure browser is in light mode (system preferences or dev tools)
   - Locate code block in stage content
   - **Expected**:
     - Code block has light gray background (`bg-gray-100`)
     - Text is dark gray/black (`text-gray-900`)
     - Border is visible (`border-gray-300`)
     - Padding is comfortable (4 units)
     - Font is monospace
   - **Acceptance**: Text is easily readable without eye strain

3. **Verify Dark Mode Readability**:
   - Switch browser/OS to dark mode
   - Reload page to apply dark mode theme
   - **Expected**:
     - Code block has dark gray/black background (`bg-gray-900`)
     - Text is light gray/white (`text-gray-100`)
     - Border is visible (`border-gray-700`)
     - Styling is consistent with light mode
   - **Acceptance**: Text is easily readable in dark environment

4. **Test Contrast Ratio**:
   - Open Chrome DevTools → Elements tab
   - Inspect code block `<pre>` element
   - Click "Contrast" badge in Styles panel
   - **Expected**: Contrast ratio ≥ 4.5:1 (WCAG AA compliant)
   - **Acceptance**: No accessibility warnings shown

5. **Test Inline Code Rendering**:
   - Find inline code in paragraph text (e.g., `function example()`)
   - **Expected**:
     - Background color differs from surrounding text
     - Padding on left/right for spacing
     - Rounded corners
   - **Acceptance**: Inline code visually distinct from normal text

**Pass Criteria**:

- [x] Light mode code blocks readable (4.5:1 contrast)
- [x] Dark mode code blocks readable (4.5:1 contrast)
- [x] No accessibility errors in DevTools
- [x] Inline code visually distinct
- [x] No regressions to other markdown elements

---

### Test Scenario 2: Knowledge Map Mastery Display (FR-004, FR-005, FR-006, FR-007)

**Objective**: Verify mastery levels are calculated and displayed on knowledge map.

**Setup**:

1. **Create Fresh Session**:
   - Open browser in incognito/private mode
   - Navigate to `http://localhost:3000`
   - sessionStorage will be empty (no quiz history)

2. **Initial State (No Quizzes Taken)**:
   - Go to Knowledge Map page
   - **Expected**: All concepts show "0% Mastery" or "Beginner" badge
   - **Acceptance**: No errors, mastery calculation handles division by zero

3. **Take Quiz with Poor Performance (0-40% accuracy)**:
   - Navigate to a stage
   - Complete quiz with 2 correct / 5 total (40% accuracy)
   - Return to Knowledge Map
   - **Expected**:
     - Concept shows "40% Mastery" or "Beginner" badge
     - Badge color is red/orange (`bg-red-100 text-red-900`)
     - Border color indicates beginner level
   - **Acceptance**: Mastery percentage matches quiz accuracy

4. **Take Quiz with Intermediate Performance (41-70% accuracy)**:
   - Navigate to another stage
   - Complete quiz with 6 correct / 10 total (60% accuracy overall)
   - Return to Knowledge Map
   - **Expected**:
     - Concept shows "60% Mastery" or "Intermediate" badge
     - Badge color is yellow (`bg-yellow-100 text-yellow-900`)
     - Visual distinction from beginner concepts
   - **Acceptance**: Mastery updates reflect cumulative accuracy

5. **Take Quiz with Advanced Performance (71-89% accuracy)**:
   - Complete another quiz with 8 correct / 10 total (70% cumulative)
   - Return to Knowledge Map
   - **Expected**:
     - Concept shows "70-89% Mastery" or "Advanced" badge
     - Badge color is light green (`bg-green-100 text-green-900`)
   - **Acceptance**: Color progression is clear

6. **Take Quiz with Master Performance (90-100% accuracy)**:
   - Complete quiz with 10 correct / 10 total (90%+ cumulative)
   - Return to Knowledge Map
   - **Expected**:
     - Concept shows "90-100% Mastery" or "Master" badge
     - Badge color is dark green (`bg-green-200 text-green-950`)
   - **Acceptance**: Highest mastery level visually distinct

7. **Performance Validation**:
   - Open Chrome DevTools → Performance tab
   - Record page load of Knowledge Map with 20+ concepts
   - **Expected**: Mastery calculation completes in <100ms (NFR-002)
   - **Acceptance**: No performance warnings, smooth rendering

8. **Accessibility Check**:
   - Run Lighthouse accessibility audit (DevTools → Lighthouse)
   - **Expected**: All mastery badges pass color contrast (≥4.5:1)
   - **Acceptance**: No accessibility regressions

**Pass Criteria**:

- [x] Zero state (no quizzes) displays 0% mastery
- [x] Mastery percentage matches quiz accuracy
- [x] 4 mastery levels visually distinct (red → yellow → light green → dark green)
- [x] Color contrast ≥4.5:1 for all levels
- [x] Calculation completes in <100ms for 20+ concepts
- [x] No accessibility errors

---

### Test Scenario 3: Session Time Tracking (FR-008, FR-009)

**Objective**: Verify session duration is calculated correctly and displayed in human-readable format.

**Steps**:

1. **Initial Session Start**:
   - Open browser in incognito/private mode
   - Navigate to `http://localhost:3000`
   - Open DevTools → Application → Session Storage
   - **Expected**:
     - Key `sessionStartTime` exists
     - Value is a timestamp (e.g., "1728123456789")
   - **Acceptance**: Timestamp is set on first load

2. **Immediate Duration Check (< 1 minute)**:
   - Navigate to Progress page immediately
   - **Expected**:
     - Header shows "Time spent: Xs" (e.g., "Time spent: 5s")
     - Duration is ≤10 seconds
   - **Acceptance**: Duration format uses seconds for <1 minute

3. **Short Duration Check (1-60 minutes)**:
   - Wait 2-3 minutes (or manually adjust `sessionStartTime` in sessionStorage)
   - Adjust timestamp: `sessionStartTime = Date.now() - (3 * 60 * 1000)` (3 minutes ago)
   - Refresh Progress page
   - **Expected**:
     - Header shows "Time spent: 3m 0s" format
     - Minutes are displayed
   - **Acceptance**: Duration format shows minutes and seconds

4. **Long Duration Check (> 1 hour)**:
   - Manually adjust `sessionStartTime` to 1.5 hours ago
   - In DevTools console: `sessionStorage.setItem('sessionStartTime', Date.now() - (90 * 60 * 1000))`
   - Refresh Progress page
   - **Expected**:
     - Header shows "Time spent: 1h 30m" format
     - Hours are displayed, seconds omitted
   - **Acceptance**: Human-readable format for long sessions

5. **Navigation Persistence**:
   - Navigate between pages: Knowledge Map → Stage → Quiz → Progress
   - **Expected**:
     - `sessionStartTime` persists in sessionStorage
     - Duration continues to increment
     - No reset on navigation
   - **Acceptance**: Session time survives page changes

6. **Page Reload Persistence**:
   - Hard reload page (Cmd+Shift+R / Ctrl+Shift+F5)
   - Check Progress page again
   - **Expected**:
     - `sessionStartTime` still exists
     - Duration reflects total time since first load
   - **Acceptance**: Session time survives reload

7. **Browser Close Reset**:
   - Close browser tab completely
   - Open new tab to `http://localhost:3000`
   - **Expected**:
     - New `sessionStartTime` is set
     - Duration resets to 0
   - **Acceptance**: New session starts after browser close

8. **Edge Case: Missing Timestamp**:
   - In DevTools console: `sessionStorage.removeItem('sessionStartTime')`
   - Refresh Progress page
   - **Expected**:
     - New `sessionStartTime` is created
     - Duration shows 0s (or very small value)
     - No errors in console
   - **Acceptance**: Graceful fallback for missing data

9. **Edge Case: Invalid Timestamp**:
   - In DevTools console: `sessionStorage.setItem('sessionStartTime', 'invalid')`
   - Refresh Progress page
   - **Expected**:
     - Duration shows 0s or very small value
     - No errors in console
     - New valid timestamp is set
   - **Acceptance**: Graceful error handling

**Pass Criteria**:

- [x] sessionStartTime created on first load
- [x] Duration persists across navigation
- [x] Duration persists across page reload
- [x] Duration resets on browser close
- [x] Format: seconds for <1m, minutes for 1-60m, hours for >60m
- [x] Missing timestamp handled gracefully
- [x] Invalid timestamp handled gracefully
- [x] No console errors

---

## Regression Testing

**Objective**: Ensure no existing features are broken by Feature 004.

**Areas to Check**:

1. **Quiz Functionality**:
   - Complete a quiz end-to-end
   - **Expected**: Quiz submission, scoring, and progress update work unchanged
   - **Acceptance**: No regressions

2. **Stage Navigation**:
   - Navigate between stages
   - **Expected**: Unlocking logic, content display, and navigation work unchanged
   - **Acceptance**: No regressions

3. **Knowledge Map Graph**:
   - View knowledge map with prerequisites
   - **Expected**: Graph layout, edges, and interactivity work unchanged (only mastery badges added)
   - **Acceptance**: No visual or functional regressions

4. **Markdown Rendering (Non-Code)**:
   - View stage with headers, lists, links, images
   - **Expected**: All markdown elements render correctly (not just code blocks)
   - **Acceptance**: No styling regressions

5. **Performance**:
   - Run Lighthouse performance audit
   - **Expected**: LCP ≤2.0s, CLS ≤0.1, TBT ≤200ms (from constitution)
   - **Acceptance**: No performance budget violations

---

## Browser Compatibility

**Test in Multiple Browsers**:

- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Safari (latest, macOS)
- [x] Edge (latest)

**Expected**: All test scenarios pass in all browsers.

---

## Accessibility Validation

**Tools**:

- Chrome DevTools Lighthouse (Accessibility audit)
- axe DevTools extension (optional)

**Steps**:

1. Run Lighthouse audit on all pages: Home, Knowledge Map, Stage, Quiz, Progress
2. **Expected**: 100% accessibility score (or no regressions from baseline)
3. **Focus areas**:
   - Color contrast for code blocks (≥4.5:1)
   - Color contrast for mastery badges (≥4.5:1)
   - Semantic HTML preserved
   - No keyboard navigation issues

**Pass Criteria**: No new accessibility errors introduced.

---

## Testing Summary Checklist

### Feature Testing

- [ ] Code snippets readable in light mode
- [ ] Code snippets readable in dark mode
- [ ] WCAG AA contrast verified
- [ ] Mastery levels calculated correctly (0%, 40%, 60%, 80%, 95%)
- [ ] Mastery colors distinct (4 levels)
- [ ] Mastery calculation <100ms
- [ ] Session time tracking accurate
- [ ] Time format human-readable
- [ ] Time persists across navigation
- [ ] Time resets on browser close

### Regression Testing

- [ ] Quizzes work unchanged
- [ ] Stage navigation works unchanged
- [ ] Knowledge map graph works unchanged
- [ ] Markdown rendering (non-code) works unchanged
- [ ] Performance budgets maintained

### Cross-Browser Testing

- [ ] Chrome tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] Edge tested

### Accessibility Testing

- [ ] Lighthouse audit passed
- [ ] No color contrast errors
- [ ] No keyboard navigation regressions

**Final Acceptance**: All checkboxes checked = Feature 004 ready for production.

---

## Troubleshooting

### Issue: Code blocks not styled

**Symptoms**: Code blocks appear as plain text with no background.

**Check**:

1. Inspect element in DevTools
2. Verify Tailwind classes applied (`bg-gray-100`, `text-gray-900`, etc.)
3. Check if global CSS is overriding styles

**Solution**: Ensure `MarkdownRenderer.tsx` wraps content in `.markdown-content` class.

### Issue: Mastery shows NaN%

**Symptoms**: Mastery badge displays "NaN%" or blank.

**Check**:

1. Open DevTools console for errors
2. Check sessionStorage for `sessionCounters` data
3. Verify `totalQuestionsAnswered > 0`

**Solution**: Ensure division-by-zero check in `calculateMastery()` function.

### Issue: Session time not incrementing

**Symptoms**: Duration stuck at 0s or doesn't update.

**Check**:

1. Verify `sessionStartTime` exists in sessionStorage (Application tab)
2. Check if timestamp is valid number
3. Refresh Progress page to see update

**Solution**: Ensure `sessionStartTime` is set on app initialization.

### Issue: Dark mode not working

**Symptoms**: Dark mode code blocks look the same as light mode.

**Check**:

1. Verify `dark:` Tailwind variants applied
2. Check if `<html>` has `dark` class (Next.js dark mode detection)
3. Test system preferences for dark mode

**Solution**: Ensure Tailwind dark mode configured (`darkMode: 'class'` in `tailwind.config.js`).

---

## Developer Notes

**Key Files Modified**:

- `src/components/MarkdownRenderer.tsx` (code block styling)
- `src/app/knowledge-map/page.tsx` (mastery calculation)
- `src/components/KnowledgeMap.tsx` (mastery display)
- `src/services/LearnerService.ts` (time tracking fix)
- `src/app/layout.tsx` or `src/app/page.tsx` (sessionStartTime initialization)

**Testing Duration**: ~30 minutes for full manual test suite

**Automation Note**: Consider adding E2E tests for these scenarios in future (Playwright/Cypress).
