# Tasks: Modern Educational MCP Learning App

**Input**: Design documents from `/specs/001-i-m-building/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → Tech stack: Next.js 14+ static export, TypeScript, shadcn/ui, Tailwind CSS
   → Structure: Static frontend with embedded educational content
2. Load design documents:
   → data-model.md: 8 core entities (Learner, Stage, Module, Quiz, etc.)
   → contracts/: Client-side service interfaces (6 services)
   → research.md: Next.js static export, embedded content strategy
   → quickstart.md: 10 user scenarios and validation steps
3. Generate tasks by category:
   → Setup: Next.js project, TypeScript, shadcn/ui, dependencies
   → Content Structure: Embedded MCP content, TypeScript definitions
   → Services: Client-side business logic (6 services)
   → UI Components: React components for learning interface
   → Integration: Routing, state management, performance
   → Validation: Tests and quickstart scenarios
4. Apply task rules:
   → Different components/services = mark [P] for parallel
   → Same file modifications = sequential (no [P])
   → Content structure before UI components
   → Services before UI integration
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend structure**: `src/`, `components/`, `content/`, `lib/` at repository root
- Static content embedded in TypeScript modules
- No backend required (static export)

## Phase 3.1: Project Setup & Foundation

### T001: ✅ Initialize Next.js Project with Static Export

**File**: `next.config.js`, `package.json`, `tsconfig.json`
**Status**: COMPLETED

- ✅ Create Next.js 15.0.0 project with TypeScript support
- ✅ Configure static export (`output: 'export'`) in next.config.js
- ✅ Set up Tailwind CSS configuration
- ✅ Configure absolute imports with `@/` prefix

### T002: ✅ [P] Install and Configure Dependencies

**File**: `package.json`
**Status**: COMPLETED

- ✅ Install shadcn/ui dependencies (Radix UI primitives)
- ✅ Install development dependencies: Jest, Playwright, ESLint, Prettier
- ✅ Install utility libraries: clsx, tailwind-merge, lucide-react
- ✅ Configure scripts for dev, build, test, lint

### T003: ✅ [P] Setup shadcn/ui Components Library

**File**: `components/ui/`, `lib/utils.ts`
**Status**: COMPLETED

- ✅ Initialize shadcn/ui with `npx shadcn-ui@latest init`
- ✅ Install base components: Button, Card, Badge, Progress, Dialog
- ✅ Configure design tokens and CSS variables
- ✅ Set up utility functions for className merging

### T004: ✅ [P] Configure Development Tools

**File**: `.eslintrc.json`, `.prettierrc`, `playwright.config.ts`
**Status**: COMPLETED

- ✅ Configure ESLint with Next.js and TypeScript rules
- ✅ Set up Prettier formatting rules
- ✅ Configure Playwright for E2E testing
- ✅ Set up Jest for unit testing with React Testing Library

## Phase 3.2: Type Definitions & Data Models

### T005: ✅ [P] Core Type Definitions

**File**: `src/types/index.ts`
**Status**: COMPLETED

- ✅ Implement Learner, Stage, Module, Quiz, Question interfaces from data-model.md
- ✅ Define StageId, StageStatus, ModuleId, ConceptId type unions
- ✅ Export all types for application-wide use
- ✅ Add JSDoc comments for type documentation

### T006: ✅ [P] Content Structure Types

**File**: `src/types/index.ts`
**Status**: COMPLETED

- ✅ Define ModuleContent, ContentSection, CodeExample interfaces
- ✅ Implement QuizAttempt, QuizResult, SessionCounters types
- ✅ Create validation schemas using TypeScript
- ✅ Define content versioning types

### T007: ✅ [P] Service Contract Interfaces

**File**: `src/types/index.ts`
**Status**: COMPLETED

- ✅ Implement LearnerService, QuizService, ContentService interfaces
- ✅ Define AnalyticsService, FeedbackService, StorageService contracts
- ✅ Create ServiceError and ValidationResult types
- ✅ Add error handling type definitions

## Phase 3.3: Embedded Content Structure

### T008: ✅ [P] MCP Content Definitions (Foundations Stage)

**File**: `src/services/ContentService.ts` (embedded)
**Status**: COMPLETED

- ✅ Create Foundations stage with 4 modules covering MCP basics
- ✅ Include learning objectives, estimated times, prerequisites
- ✅ Embed quiz with 8 questions (70% passing threshold)
- ✅ Link to related concepts for knowledge map

### T009: ✅ [P] MCP Content Definitions (Architecture & Messages)

**File**: `src/services/ContentService.ts` (embedded)
**Status**: COMPLETED

- ✅ Create Architecture & Messages stage content
- ✅ Cover MCP protocol structure, message types, session negotiation
- ✅ Include interactive examples and code snippets
- ✅ Design quiz focused on protocol understanding

### T010: ✅ [P] MCP Content Definitions (Advanced Patterns)

**File**: `src/services/ContentService.ts` (embedded)
**Status**: COMPLETED

- ✅ Create Advanced Patterns stage with complex MCP scenarios
- ✅ Cover error handling, connection management, advanced features
- ✅ Include real-world implementation examples
- ✅ Design challenging quiz for advanced concepts

### T011: ✅ [P] MCP Content Definitions (Building & Debugging)

**File**: `src/services/ContentService.ts` (embedded)
**Status**: COMPLETED

- ✅ Create practical implementation guidance stage
- ✅ Cover MCP server/client development, testing strategies
- ✅ Include debugging techniques and common pitfalls
- ✅ Focus quiz on practical implementation skills

### T012: ✅ [P] MCP Content Definitions (Mastery Stage)

**File**: `src/services/ContentService.ts` (embedded)
**Status**: COMPLETED

- ✅ Create comprehensive mastery stage content
- ✅ Cover advanced topics, performance optimization, best practices
- ✅ Include capstone-style challenges and scenarios
- ✅ Design comprehensive final assessment

### T013: ✅ [P] MCP Concept Definitions for Knowledge Map

**File**: `src/services/ContentService.ts`
**Status**: COMPLETED

- ✅ Define 30+ MCP concepts with descriptions and relationships
- ✅ Organize by categories: protocol, transport, security, implementation, patterns
- ✅ Create concept relationship mappings for knowledge graph
- ✅ Include links to related modules and stages

### T014: ⚠️ Content Version Management

**File**: `src/services/ContentService.ts`
**Status**: PARTIAL - Basic implementation, no build-time versioning

- ⚠️ Implement content versioning system with build-time hash generation
- ⚠️ Create content update detection mechanism
- ⚠️ Set up build script to generate version metadata
- ⚠️ Implement update notification badge logic

## Phase 3.4: Core Services Implementation

### T015: ✅ [P] Storage Service Implementation

**File**: `src/services/StorageService.ts`
**Status**: COMPLETED

- ✅ Implement sessionStorage operations with error handling
- ✅ Add storage quota management and cleanup
- ✅ Create graceful degradation for storage unavailable scenarios
- ✅ Include storage usage monitoring

### T016: ✅ [P] Learner Service Implementation

**File**: `src/services/LearnerService.ts`
**Status**: COMPLETED

- ✅ Implement session management and progress tracking
- ✅ Create stage status updates and module completion tracking
- ✅ Add progress summary calculations
- ✅ Handle user preferences and theme settings

### T017: ✅ [P] Quiz Service Implementation

**File**: `src/services/QuizService.ts`
**Status**: COMPLETED

- ✅ Implement quiz attempt management and scoring
- ✅ Create adaptive recommendation engine for failed quizzes
- ✅ Add quiz history tracking and analytics
- ✅ Handle incomplete quiz resumption logic

### T018: ✅ [P] Content Service Implementation

**File**: `src/services/ContentService.ts`
**Status**: COMPLETED

- ✅ Implement stage and module access with unlocking logic
- ✅ Create concept retrieval and knowledge map data
- ✅ Add content versioning and update detection
- ✅ Handle content search and filtering

### T019: ✅ [P] Analytics Service Implementation

**File**: `src/services/AnalyticsService.ts`
**Status**: COMPLETED

- ✅ Implement session-only analytics tracking
- ✅ Create interaction counters and session duration tracking
- ✅ Add event tracking for stages, modules, quizzes
- ✅ Ensure no persistent storage or external transmission

### T020: ✅ [P] Feedback Service Implementation

**File**: `src/services/FeedbackService.ts`
**Status**: COMPLETED

- ✅ Implement transient feedback collection (👍/👎 + comments)
- ✅ Create feedback summary and analysis
- ✅ Add session-only storage with automatic cleanup
- ✅ Handle feedback display and interaction

### T021: ✅ Service Factory and App Service

**File**: `src/services/index.ts`
**Status**: COMPLETED

- ✅ Create service exports for dependency injection
- ✅ Implement main service composition
- ✅ Add application lifecycle management
- ✅ Handle global error handling and service coordination

## Phase 3.5: React Context and State Management

### T022: ⚠️ [P] Learner Context Provider

**File**: Not implemented (services used directly)
**Status**: SKIPPED - Using direct service calls instead

- ⚠️ Services accessed directly in components
- ⚠️ State managed with useState in components
- ⚠️ No centralized context provider needed for static app

### T023: ⚠️ [P] Content Context Provider

**File**: Not implemented (services used directly)
**Status**: SKIPPED - Using direct service calls instead

- ⚠️ Content accessed directly via ContentService
- ⚠️ No caching layer needed for static content
- ⚠️ Direct service integration in pages

### T024: ⚠️ Quiz Context Provider

**File**: Not implemented (services used directly)
**Status**: SKIPPED - Using direct service calls instead

- ⚠️ Quiz state managed locally in quiz pages
- ⚠️ Direct QuizService integration
- ⚠️ No shared quiz state needed

## Phase 3.6: UI Components (shadcn/ui Based)

### T025: ✅ [P] Stage Card Component

**File**: `src/components/StageCard.tsx`
**Status**: COMPLETED

- ✅ Create stage overview card with progress indicator
- ✅ Add locked/unlocked states with visual feedback
- ✅ Implement estimated time display and objectives preview
- ✅ Handle stage navigation and prerequisite messaging

### T026: ✅ [P] Module Content Component

**File**: `src/components/ModuleCard.tsx`
**Status**: COMPLETED

- ✅ Create module card display component
- ✅ Add completion status indicators
- ✅ Implement progress tracking and completion marking
- ✅ Handle navigation between modules

### T027: ✅ [P] Quiz Interface Component

**File**: `src/components/QuizQuestion.tsx`
**Status**: COMPLETED

- ✅ Create multiple choice quiz interface
- ✅ Add question navigation and answer selection
- ✅ Implement progress tracking
- ✅ Handle quiz submission and scoring

### T028: ✅ [P] Knowledge Map Component

**File**: `src/components/KnowledgeMap.tsx`
**Status**: COMPLETED

- ✅ Create interactive concept visualization
- ✅ Implement concept relationships and navigation
- ✅ Add search and filtering capabilities
- ✅ Handle responsive design

### T029: ✅ [P] Progress Indicator Components

**File**: `src/components/ProgressBar.tsx`, `src/components/ui/progress.tsx`
**Status**: COMPLETED

- ✅ Create stage progression bar component
- ✅ Add percentage badges and completion indicators
- ✅ Implement animated progress updates
- ✅ Handle responsive design for mobile

### T030: ⚠️ [P] Deep Dive Panel Component

**File**: Not implemented separately
**Status**: SKIPPED - Integrated into module/concept pages

- ⚠️ Concept details shown in module pages
- ⚠️ No separate panel component
- ⚠️ Related content navigation in modules

### T031: ✅ [P] Feedback Components

**File**: `src/components/FeedbackDialog.tsx`
**Status**: COMPLETED

- ✅ Create thumbs up/down feedback interface
- ✅ Add optional comment input (140 char limit)
- ✅ Implement session-only feedback display
- ✅ Handle feedback submission and confirmation

## Phase 3.7: Page Components and Routing

### T032: ✅ Landing Page Layout

**File**: `src/app/page.tsx`
**Status**: COMPLETED

- ✅ Create main landing page with MCP overview
- ✅ Add stage progression display
- ✅ Implement navigation to stages
- ✅ Handle responsive mobile-first design

### T033: ✅ [P] Stage Detail Page

**File**: `src/app/stage/[stageId]/page.tsx`
**Status**: COMPLETED

- ✅ Create stage detail view with modules list
- ✅ Add quiz access and completion status
- ✅ Implement learning objectives display
- ✅ Handle prerequisite checking and unlocking

### T034: ✅ [P] Module Detail Page

**File**: `src/app/module/[moduleId]/page.tsx`
**Status**: COMPLETED

- ✅ Create module content display page
- ✅ Add module navigation and progress tracking
- ✅ Implement concept linking and highlighting
- ✅ Handle completion marking and next module navigation

### T035: ✅ [P] Quiz Page

**File**: `src/app/quiz/[stageId]/page.tsx`
**Status**: COMPLETED

- ✅ Create quiz interface page with question display
- ✅ Add quiz navigation and answer tracking
- ✅ Implement scoring and feedback display
- ✅ Handle quiz completion and stage unlocking

### T036: ✅ App Layout and Navigation

**File**: `src/app/layout.tsx`, `src/components/NavigationHeader.tsx`
**Status**: COMPLETED

- ✅ Create responsive app layout with navigation
- ✅ Add breadcrumb navigation and back buttons
- ✅ Implement theme provider and global styles
- ✅ Handle mobile-first responsive design
- ✅ Error boundary integration

### T037: ✅ Additional Pages

**File**: `src/app/progress/page.tsx`, `src/app/knowledge-map/page.tsx`, `src/app/about/page.tsx`
**Status**: COMPLETED

- ✅ Progress dashboard with analytics
- ✅ Knowledge map visualization page
- ✅ About page with platform information
- ✅ 404 not-found page

## Phase 3.8: Performance and Optimization

### T038: ⚠️ [P] Code Splitting and Lazy Loading

**File**: Dynamic imports, `next.config.js`
**Status**: PARTIAL

- ⚠️ Basic Next.js automatic code splitting
- ⚠️ No explicit lazy loading implemented
- ⚠️ Bundle size not optimized to target
- ⚠️ No performance monitoring set up

### T039: ⚠️ [P] Image Optimization and Assets

**File**: `src/assets/`, `next.config.js`
**Status**: PARTIAL

- ⚠️ No images currently in use
- ⚠️ Next.js Image component available but unused
- ⚠️ No diagram assets implemented

### T040: ✅ Accessibility Implementation

**File**: Multiple components, `src/lib/accessibility.ts`
**Status**: COMPLETED

- ✅ Implement WCAG AA compliance across all components
- ✅ Add keyboard navigation and focus management
- ✅ Create screen reader optimizations with ARIA
- ✅ Handle color contrast and motion preferences
- ✅ Comprehensive ACCESSIBILITY.md documentation
- ✅ ErrorBoundary component for error handling

## Phase 3.9: Testing Implementation

### T041: ⚠️ [P] Service Unit Tests

**File**: `src/services/__tests__/`
**Status**: PARTIAL

- ✅ Test infrastructure set up with Jest
- ✅ Sample tests created for LearnerService and ContentService
- ⚠️ Tests have API mismatch issues needing fixes
- ⚠️ Not all services have tests yet
- ⚠️ Coverage below 80% target

### T042: ⚠️ [P] Component Unit Tests

**File**: `src/components/**/__tests__/`
**Status**: NOT STARTED

- ❌ No React Testing Library tests created
- ❌ No user interaction tests
- ❌ No snapshot tests implemented
- ❌ No component coverage

### T043: ⚠️ [P] Integration Tests

**File**: `tests/integration/`
**Status**: NOT STARTED

- ✅ Playwright configured
- ❌ No E2E tests created
- ❌ No user journey tests
- ❌ No cross-browser testing

### T044: ⚠️ [P] Performance Tests

**File**: `tests/performance/`
**Status**: NOT STARTED

- ❌ No Lighthouse CI tests
- ❌ No performance budget validation
- ❌ No real device testing
- ❌ No accessibility score validation

## Phase 3.10: Content Integration and Validation

### T045: ⚠️ MCP Content Integration with context7

**File**: Build scripts, content generation
**Status**: NOT IMPLEMENTED

- ❌ No context7 integration
- ✅ Manual MCP content created and embedded
- ⚠️ Content accuracy needs validation
- ❌ No automated content refresh

### T046: ⚠️ [P] Content Validation Scripts

**File**: `scripts/validate-content.js`
**Status**: NOT STARTED

- ❌ No validation scripts created
- ⚠️ Quiz questions need validation
- ⚠️ Concept relationships need checking
- ⚠️ Educational requirements not formalized

### T047: ⚠️ Quickstart Validation Implementation

**File**: Execute quickstart.md scenarios
**Status**: PARTIAL

- ✅ All user journeys functional in development
- ⚠️ Not all quickstart scenarios formally tested
- ⚠️ Edge cases need verification
- ⚠️ Performance requirements not validated

### T048: ⚠️ Final Integration and Deployment Prep

**File**: Build configuration, deployment scripts
**Status**: PARTIAL

- ✅ Static export configured
- ⚠️ Build has issues with Next.js 15 client components
- ✅ Documentation created (README.md)
- ⚠️ Deployment not yet tested
- ⚠️ Production build not working (generateStaticParams conflict)

## Dependencies

- Setup (T001-T004) before all other phases
- Type definitions (T005-T007) before services and components
- Content structure (T008-T014) before UI components
- Services (T015-T021) before UI integration
- Context providers (T022-T024) before page components
- Core components (T025-T031) before pages (T032-T036)
- Implementation complete before testing (T040-T043)
- Content integration (T044-T045) can run parallel with component development
- Final validation (T046-T047) requires all other tasks complete

## Parallel Execution Examples

### Phase 3.2 - Type Definitions (Can run simultaneously)

```
Task: "Core Type Definitions in src/types/index.ts"
Task: "Content Structure Types in src/types/content.ts" 
Task: "Service Contract Interfaces in src/types/services.ts"
```

### Phase 3.3 - Content Creation (Can run simultaneously)

```
Task: "MCP Content Definitions (Foundations Stage) in src/content/stages/foundations.ts"
Task: "MCP Content Definitions (Architecture & Messages) in src/content/stages/architecture-messages.ts"
Task: "MCP Content Definitions (Advanced Patterns) in src/content/stages/advanced-patterns.ts"
Task: "MCP Content Definitions (Building & Debugging) in src/content/stages/building-debugging.ts"
Task: "MCP Content Definitions (Mastery Stage) in src/content/stages/mastery.ts"
Task: "MCP Concept Definitions for Knowledge Map in src/content/concepts/"
```

### Phase 3.4 - Services (Can run simultaneously)

```
Task: "Storage Service Implementation in src/lib/services/storage-service.ts"
Task: "Learner Service Implementation in src/lib/services/learner-service.ts"
Task: "Quiz Service Implementation in src/lib/services/quiz-service.ts"
Task: "Content Service Implementation in src/lib/services/content-service.ts"
Task: "Analytics Service Implementation in src/lib/services/analytics-service.ts"
Task: "Feedback Service Implementation in src/lib/services/feedback-service.ts"
```

## Notes

- [P] tasks = different files, no shared dependencies
- Test-driven approach: Write failing tests, then implement
- Commit after each completed task
- Performance budget validation required before deployment
- Accessibility testing required for all interactive components
- Content accuracy validation against official MCP documentation required

## Success Criteria

- All quickstart scenarios pass validation
- Performance budgets met: <2.0s first interactive, ≤180KB gzip JS
- WCAG AA accessibility compliance verified
- 5 learning stages with embedded content complete
- Knowledge map with 30+ concepts functional
- Session-only progress tracking working
- Mobile-responsive design validated
- Static export deployment ready
