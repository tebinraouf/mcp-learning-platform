# Data Model: Modern Educational MCP Learning App

**Date**: 2025-10-04  
**Source**: Derived from feature specification entities

## Core Entities

### Learner

**Purpose**: Represents anonymous session user state  
**Storage**: sessionStorage only  
**Lifecycle**: Session-bound (cleared on browser close)

```typescript
interface Learner {
  sessionId: string;           // Generated UUID for session
  stageStatuses: Record<StageId, StageStatus>;
  quizAttempts: QuizAttempt[];
  moduleCompletions: Record<ModuleId, boolean>;
  preferences: {
    theme?: 'light' | 'dark';  // Optional theme preference
  };
  sessionCounters: SessionCounters;
}

type StageStatus = 'locked' | 'in-progress' | 'completed';
type StageId = 'foundations' | 'architecture-messages' | 'advanced-patterns' | 'building-debugging' | 'mastery';
type ModuleId = string; // Format: `${stageId}-${moduleIndex}`
```

### Stage

**Purpose**: Structured learning level with modules and assessment  
**Storage**: Static embedded content  
**Relationships**: Contains modules, has one quiz

```typescript
interface Stage {
  id: StageId;
  name: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  sequenceOrder: number;
  prerequisites: StageId[];
  modules: Module[];
  quiz: Quiz;
  concepts: ConceptId[];       // Related concepts for knowledge map
}
```

### Module

**Purpose**: Discrete instructional unit within a stage  
**Storage**: Static embedded content  

```typescript
interface Module {
  id: ModuleId;
  stageId: StageId;
  title: string;
  objectives: string[];
  content: ModuleContent;
  estimatedMinutes: number;
  relatedConcepts: ConceptId[];
  sequenceOrder: number;
}

interface ModuleContent {
  sections: ContentSection[];
  examples?: CodeExample[];
  diagrams?: DiagramReference[];
}

interface ContentSection {
  heading: string;
  body: string;              // Markdown content
  type: 'text' | 'example' | 'interactive';
}
```

### Quiz

**Purpose**: Stage assessment with multiple choice questions  
**Storage**: Static embedded content  
**Validation**: Single correct answer per question

```typescript
interface Quiz {
  id: string;
  stageId: StageId;
  questions: Question[];
  passingThreshold: number;  // 0.7 (70%)
  timeLimit?: number;        // Optional time limit in minutes
}

interface Question {
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctAnswerId: string;
  rationale: string;         // Explanation for correct answer
  conceptTag: ConceptId;     // Single concept tag
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}
```

### QuizAttempt

**Purpose**: Track quiz attempt history and performance  
**Storage**: sessionStorage (session-only)  

```typescript
interface QuizAttempt {
  id: string;
  quizId: string;
  stageId: StageId;
  timestamp: Date;
  answers: QuizAnswer[];
  score: number;             // 0-1 decimal
  passed: boolean;           // score >= passingThreshold
  completedAt?: Date;
}

interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent?: number;        // Seconds on question
}
```

### Concept

**Purpose**: MCP topic definition for knowledge map  
**Storage**: Static embedded content (from context7)  
**Relationships**: Many-to-many with modules

```typescript
interface Concept {
  id: ConceptId;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ConceptCategory;
  relatedConcepts: ConceptId[];
  associatedModules: ModuleId[];
  mcpSpecSection?: string;   // Reference to MCP spec section
}

type ConceptId = string;
type ConceptCategory = 'protocol' | 'transport' | 'security' | 'implementation' | 'patterns';
```

### ProgressRecord

**Purpose**: Aggregate learner progress metrics  
**Storage**: Computed from other entities (not persisted)  

```typescript
interface ProgressRecord {
  totalStages: number;
  completedStages: number;
  currentStage?: StageId;
  overallProgress: number;        // 0-1 decimal
  stageProgress: Record<StageId, StageProgress>;
  estimatedTimeRemaining: number; // Minutes
}

interface StageProgress {
  status: StageStatus;
  moduleCompletion: number;   // 0-1 decimal
  quizBestScore?: number;     // Best quiz score (0-1)
  attemptCount: number;
}
```

### FeedbackEntry

**Purpose**: Optional learner sentiment tracking  
**Storage**: sessionStorage (transient, session-only)  

```typescript
interface FeedbackEntry {
  id: string;
  timestamp: Date;
  type: 'thumbs-up' | 'thumbs-down';
  context: 'stage' | 'module' | 'quiz';
  contextId: string;          // stageId, moduleId, or quizId
  comment?: string;           // Max 140 characters
}
```

### SessionCounters

**Purpose**: Aggregate session analytics (non-persistent)  
**Storage**: sessionStorage (in-memory equivalent)  

```typescript
interface SessionCounters {
  stageStarts: Record<StageId, number>;
  quizAttempts: Record<StageId, number>;
  quizPasses: Record<StageId, number>;
  moduleViews: Record<ModuleId, number>;
  sessionDuration: number;    // Milliseconds
  interactionCount: number;   // Total clicks/interactions
}
```

## Data Relationships

### Primary Relationships

- **Stage** → contains → **Module[]** (1:many)
- **Stage** → has → **Quiz** (1:1)
- **Concept** ↔ links to ↔ **Module** (many:many)
- **Learner** → tracks → **QuizAttempt[]** (1:many)

### Computed Relationships

- **ProgressRecord** ← derived from → **Learner state**
- **Stage unlocking** ← determined by → **Prerequisites + Quiz scores**

## Storage Schema

### sessionStorage Keys

```typescript
const STORAGE_KEYS = {
  LEARNER_STATE: 'mcp-learner-state',
  SESSION_COUNTERS: 'mcp-session-counters',
  FEEDBACK_ENTRIES: 'mcp-feedback-entries',
  CONTENT_VERSION: 'mcp-content-version'    // For update detection
} as const;
```

### Static Content Structure

```
content/
├── stages/
│   ├── foundations.ts
│   ├── architecture-messages.ts
│   ├── advanced-patterns.ts
│   ├── building-debugging.ts
│   └── mastery.ts
├── concepts/
│   ├── index.ts              # All concepts export
│   └── categories/
│       ├── protocol.ts
│       ├── transport.ts
│       ├── security.ts
│       ├── implementation.ts
│       └── patterns.ts
└── metadata/
    ├── app-config.ts         # App constants
    └── content-version.ts    # Build version hash
```

## Validation Rules

### Quiz Validation

- Minimum 5, maximum 8 questions per stage quiz
- Each question has 3-5 options, exactly 1 correct
- All questions must have non-empty rationale
- Passing threshold fixed at 70%

### Progress Validation

- Stage can only be unlocked if all prerequisites completed
- Quiz must be passed (score ≥ 70%) to complete stage
- Module completion independent of quiz (can view without quiz)

### Session Data Limits

- Maximum 50 quiz attempts per session (prevent session storage bloat)
- Maximum 20 feedback entries per session
- Session data automatically cleared on storage quota exceeded

## Migration Strategy

**Content Updates**: Static rebuild replaces all content; no migration needed  
**Session Compatibility**: Graceful degradation if session data schema changes  
**Version Detection**: Content version hash comparison for update notifications

## Performance Considerations

### Bundle Optimization

- Lazy load stage content (not all stages in initial bundle)
- Tree-shake unused concepts from knowledge map
- Compress quiz data (minimal JSON structure)

### Runtime Efficiency  

- Memoize computed progress calculations
- Debounce sessionStorage writes
- Limit quiz attempt history retention

### Memory Management

- Clear completed quiz attempt details after 24 hours (keep scores only)
- Prune old session counters on storage pressure
- Lazy initialize concept relationship graphs
