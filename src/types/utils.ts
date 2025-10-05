/**
 * Utility types and validation helpers for the MCP Learning Platform
 */

import type {
    Quiz,
    Question,
    QuizAttempt,
    QuizAnswer,
    Stage,
    Module,
    Concept,
    Learner,
    StageId,
    ModuleId,
    ConceptId,
} from './index'

// ============================================================================
// Result Types (for service operations)
// ============================================================================

export type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E }

export type ValidationResult<T = unknown> =
    | { valid: true; data: T }
    | { valid: false; errors: ValidationError[] }

export interface ValidationError {
    field: string
    message: string
    code: string
}

// ============================================================================
// Service Operation Types
// ============================================================================

export interface QuizSubmission {
    quizId: string
    answers: QuizAnswer[]
    startTime: Date
    endTime: Date
}

export interface LearnerProgress {
    sessionId: string
    completedModules: ModuleId[]
    completedStages: StageId[]
    currentStage?: StageId
    currentModule?: ModuleId
}

export interface ContentFilter {
    stageId?: StageId
    conceptCategory?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    searchQuery?: string
}

export interface AnalyticsEvent {
    type: 'page_view' | 'module_start' | 'module_complete' | 'quiz_start' | 'quiz_submit' | 'interaction'
    timestamp: Date
    metadata: Record<string, unknown>
}

// ============================================================================
// Validation Types
// ============================================================================

export interface QuizValidation {
    hasMinQuestions: boolean
    hasMaxQuestions: boolean
    allQuestionsValid: boolean
    hasPassingThreshold: boolean
    errors: string[]
}

export interface QuestionValidation {
    hasPrompt: boolean
    hasMinOptions: boolean
    hasMaxOptions: boolean
    hasExactlyOneCorrect: boolean
    hasRationale: boolean
    errors: string[]
}

export interface LearnerStateValidation {
    hasSessionId: boolean
    hasStageStatuses: boolean
    withinSessionLimits: boolean
    errors: string[]
}

// ============================================================================
// Helper Types
// ============================================================================

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

// ============================================================================
// Type Guards
// ============================================================================

export function isStageId(value: unknown): value is StageId {
    return (
        typeof value === 'string' &&
        [
            'foundations',
            'architecture-messages',
            'advanced-patterns',
            'building-debugging',
            'mastery',
        ].includes(value)
    )
}

export function isQuizAttempt(value: unknown): value is QuizAttempt {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'quizId' in value &&
        'stageId' in value &&
        'answers' in value &&
        'score' in value &&
        'passed' in value
    )
}

export function isValidScore(score: number): boolean {
    return score >= 0 && score <= 1
}

export function isValidTheme(theme: unknown): theme is 'light' | 'dark' {
    return theme === 'light' || theme === 'dark'
}

// ============================================================================
// Serialization Helpers
// ============================================================================

export interface SerializedLearner extends Omit<Learner, 'quizAttempts'> {
    quizAttempts: Array<Omit<QuizAttempt, 'timestamp' | 'completedAt'> & {
        timestamp: string
        completedAt?: string
    }>
}

export function serializeLearner(learner: Learner): SerializedLearner {
    return {
        ...learner,
        quizAttempts: learner.quizAttempts.map((attempt) => ({
            ...attempt,
            timestamp: attempt.timestamp.toISOString(),
            completedAt: attempt.completedAt?.toISOString(),
        })),
    }
}

export function deserializeLearner(serialized: SerializedLearner): Learner {
    return {
        ...serialized,
        quizAttempts: serialized.quizAttempts.map((attempt) => ({
            ...attempt,
            timestamp: new Date(attempt.timestamp),
            completedAt: attempt.completedAt ? new Date(attempt.completedAt) : undefined,
        })),
    }
}

// ============================================================================
// Content Query Types
// ============================================================================

export interface StageQuery {
    id?: StageId
    sequenceOrder?: number
    includeModules?: boolean
    includeQuiz?: boolean
}

export interface ModuleQuery {
    id?: ModuleId
    stageId?: StageId
    sequenceOrder?: number
    relatedConcepts?: ConceptId[]
}

export interface ConceptQuery {
    id?: ConceptId
    category?: string
    searchTerm?: string
    relatedTo?: ConceptId
}

// ============================================================================
// Performance Metrics Types
// ============================================================================

export interface PerformanceMetrics {
    pageLoadTime: number
    timeToInteractive: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    cumulativeLayoutShift: number
    bundleSize: number
}

export interface AccessibilityReport {
    violations: A11yViolation[]
    passes: number
    incomplete: number
    wcagLevel: 'A' | 'AA' | 'AAA'
}

export interface A11yViolation {
    id: string
    impact: 'minor' | 'moderate' | 'serious' | 'critical'
    description: string
    help: string
    helpUrl: string
    nodes: number
}
