/**
 * Core type definitions for the MCP Learning Platform
 * Generated from data-model.md specification
 */

// ============================================================================
// Stage & Module Types
// ============================================================================

export type StageId =
    | 'foundations'
    | 'architecture-messages'
    | 'advanced-patterns'
    | 'building-debugging'
    | 'mastery'

export type StageStatus = 'locked' | 'in-progress' | 'completed'

export type ModuleId = string // Format: `${stageId}-${moduleIndex}`

export type ConceptId = string

export type ConceptCategory =
    | 'protocol'
    | 'transport'
    | 'security'
    | 'implementation'
    | 'patterns'

// ============================================================================
// Core Entities
// ============================================================================

export interface Learner {
    sessionId: string
    stageStatuses: Record<StageId, StageStatus>
    quizAttempts: QuizAttempt[]
    moduleCompletions: Record<ModuleId, boolean>
    preferences: {
        theme?: 'light' | 'dark'
    }
    sessionCounters: SessionCounters
}

export interface Stage {
    id: StageId
    name: string
    description: string
    objectives: string[]
    estimatedMinutes: number
    sequenceOrder: number
    prerequisites: StageId[]
    modules: Module[]
    quiz: Quiz
    concepts: ConceptId[]
}

export interface Module {
    id: ModuleId
    stageId: StageId
    title: string
    objectives: string[]
    content: ModuleContent
    estimatedMinutes: number
    relatedConcepts: ConceptId[]
    sequenceOrder: number
}

export interface ModuleContent {
    sections: ContentSection[]
    examples?: CodeExample[]
    diagrams?: DiagramReference[]
}

export interface ContentSection {
    heading: string
    body: string // Markdown content
    type: 'text' | 'example' | 'interactive'
}

export interface CodeExample {
    language: string
    code: string
    description?: string
    filename?: string
}

export interface DiagramReference {
    type: 'mermaid' | 'image'
    source: string
    alt: string
    caption?: string
}

// ============================================================================
// Quiz Types
// ============================================================================

export interface Quiz {
    id: string
    stageId: StageId
    questions: Question[]
    passingThreshold: number // 0.7 (70%)
    timeLimit?: number // Optional time limit in minutes
}

export interface Question {
    id: string
    prompt: string
    options: QuestionOption[]
    correctAnswerId: string
    rationale: string
    conceptTag: ConceptId
    difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuestionOption {
    id: string
    text: string
    isCorrect: boolean
}

export interface QuizAttempt {
    id: string
    quizId: string
    stageId: StageId
    timestamp: Date
    answers: QuizAnswer[]
    score: number // 0-1 decimal
    passed: boolean
    completedAt?: Date
}

export interface QuizAnswer {
    questionId: string
    selectedOptionId: string
    isCorrect: boolean
    timeSpent?: number // Seconds
}

// ============================================================================
// Concept & Knowledge Map Types
// ============================================================================

export interface Concept {
    id: ConceptId
    name: string
    shortDescription: string
    fullDescription: string
    category: ConceptCategory
    relatedConcepts: ConceptId[]
    associatedModules: ModuleId[]
    mcpSpecSection?: string
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

export interface ProgressRecord {
    totalStages: number
    completedStages: number
    currentStage?: StageId
    overallProgress: number // 0-1 decimal
    stageProgress: Record<StageId, StageProgress>
    estimatedTimeRemaining: number // Minutes
}

export interface StageProgress {
    status: StageStatus
    moduleCompletion: number // 0-1 decimal
    quizBestScore?: number // Best quiz score (0-1)
    attemptCount: number
}

// ============================================================================
// Feedback & Analytics Types
// ============================================================================

export interface FeedbackEntry {
    id: string
    timestamp: Date
    type: 'thumbs-up' | 'thumbs-down'
    context: 'stage' | 'module' | 'quiz'
    contextId: string
    comment?: string // Max 140 characters
}

export interface SessionCounters {
    stageStarts: Record<StageId, number>
    quizAttempts: Record<StageId, number>
    quizPasses: Record<StageId, number>
    moduleViews: Record<ModuleId, number>
    sessionDuration: number // Milliseconds
    interactionCount: number
}

// ============================================================================
// Storage Schema
// ============================================================================

export const STORAGE_KEYS = {
    LEARNER_STATE: 'mcp-learner-state',
    SESSION_COUNTERS: 'mcp-session-counters',
    FEEDBACK_ENTRIES: 'mcp-feedback-entries',
    CONTENT_VERSION: 'mcp-content-version',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

// ============================================================================
// Validation Constants
// ============================================================================

export const QUIZ_VALIDATION = {
    MIN_QUESTIONS: 5,
    MAX_QUESTIONS: 8,
    MIN_OPTIONS: 3,
    MAX_OPTIONS: 5,
    PASSING_THRESHOLD: 0.7,
} as const

export const SESSION_LIMITS = {
    MAX_QUIZ_ATTEMPTS: 50,
    MAX_FEEDBACK_ENTRIES: 20,
    MAX_COMMENT_LENGTH: 140,
} as const
