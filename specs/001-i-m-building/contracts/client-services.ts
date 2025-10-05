/**
 * API Contracts: Modern Educational MCP Learning App
 * 
 * Purpose: Define TypeScript interfaces and validation schemas for client-side operations
 * Note: No REST/GraphQL APIs - static app with embedded content and client-side state management
 */

// Re-export all types from data model
export type {
    Learner,
    Stage,
    Module,
    Quiz,
    Question,
    QuizAttempt,
    Concept,
    ProgressRecord,
    FeedbackEntry,
    SessionCounters,
    StageId,
    StageStatus,
    ModuleId,
    ConceptId,
    ConceptCategory
} from '../data-model';

// Client-Side Service Contracts

export interface LearnerService {
    // Session management
    getCurrentLearner(): Learner | null;
    initializeSession(): Learner;
    resetProgress(): void;

    // Progress tracking
    updateStageStatus(stageId: StageId, status: StageStatus): void;
    markModuleCompleted(moduleId: ModuleId): void;
    getProgressSummary(): ProgressRecord;

    // Preferences
    updatePreferences(preferences: Partial<Learner['preferences']>): void;
}

export interface QuizService {
    // Quiz management
    getQuiz(stageId: StageId): Quiz;
    startQuizAttempt(stageId: StageId): QuizAttempt;
    submitQuizAnswer(attemptId: string, questionId: string, optionId: string): void;
    completeQuizAttempt(attemptId: string): QuizResult;

    // Quiz analysis
    getQuizHistory(stageId: StageId): QuizAttempt[];
    getRecommendedModules(attemptId: string): Module[];
    calculateScore(attemptId: string): number;
}

export interface QuizResult {
    attempt: QuizAttempt;
    passed: boolean;
    score: number;
    incorrectConcepts: ConceptId[];
    recommendedModules: ModuleId[];
}

export interface ContentService {
    // Stage and module access
    getAllStages(): Stage[];
    getStage(stageId: StageId): Stage;
    getModule(moduleId: ModuleId): Module;
    getUnlockedStages(learner: Learner): Stage[];

    // Concept and knowledge map
    getAllConcepts(): Concept[];
    getConcept(conceptId: ConceptId): Concept;
    getConceptsByCategory(category: ConceptCategory): Concept[];
    getRelatedConcepts(conceptId: ConceptId): Concept[];

    // Content versioning
    getCurrentContentVersion(): string;
    checkForUpdates(): ContentUpdateInfo;
}

export interface ContentUpdateInfo {
    hasUpdates: boolean;
    updatedStages: StageId[];
    newConcepts: ConceptId[];
    versionHash: string;
}

export interface AnalyticsService {
    // Session tracking
    incrementCounter(event: AnalyticsEvent, context?: string): void;
    getSessionCounters(): SessionCounters;
    updateSessionDuration(milliseconds: number): void;

    // Interaction tracking
    trackStageStart(stageId: StageId): void;
    trackModuleView(moduleId: ModuleId): void;
    trackQuizAttempt(stageId: StageId): void;
    trackQuizPass(stageId: StageId, score: number): void;
}

export type AnalyticsEvent = 'stage-start' | 'module-view' | 'quiz-attempt' | 'quiz-pass' | 'concept-explore' | 'progress-reset';

export interface FeedbackService {
    // Feedback collection
    submitFeedback(feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>): void;
    getFeedbackHistory(): FeedbackEntry[];

    // Feedback analysis (session-only)
    getFeedbackSummary(): FeedbackSummary;
}

export interface FeedbackSummary {
    totalEntries: number;
    positiveCount: number;
    negativeCount: number;
    byContext: Record<FeedbackEntry['context'], number>;
}

export interface StorageService {
    // Session storage operations
    saveLearnerState(learner: Learner): void;
    loadLearnerState(): Learner | null;
    saveSessionCounters(counters: SessionCounters): void;
    loadSessionCounters(): SessionCounters;

    // Storage management
    clearAllData(): void;
    getStorageUsage(): StorageUsage;
    isStorageAvailable(): boolean;
}

export interface StorageUsage {
    used: number;        // Bytes used
    available: number;   // Bytes available
    percentage: number;  // Usage percentage
}

// Validation Schemas

export const LearnerSchema = {
    sessionId: (value: string): boolean => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
    stageStatuses: (statuses: Record<StageId, StageStatus>): boolean => {
        return Object.values(statuses).every(status =>
            ['locked', 'in-progress', 'completed'].includes(status)
        );
    },
    moduleCompletions: (completions: Record<ModuleId, boolean>): boolean => {
        return Object.keys(completions).every(moduleId =>
            typeof moduleId === 'string' && moduleId.includes('-')
        );
    }
};

export const QuizAnswerSchema = {
    questionId: (value: string): boolean => typeof value === 'string' && value.length > 0,
    selectedOptionId: (value: string): boolean => typeof value === 'string' && value.length > 0,
    isCorrect: (value: boolean): boolean => typeof value === 'boolean',
    timeSpent: (value?: number): boolean => value === undefined || (typeof value === 'number' && value >= 0)
};

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export const QuizAttemptValidation = {
    validateAttempt: (attempt: QuizAttempt): ValidationResult => {
        const errors: string[] = [];

        if (!attempt.quizId || typeof attempt.quizId !== 'string') {
            errors.push('Invalid quiz ID');
        }

        if (!attempt.stageId || !isValidStageId(attempt.stageId)) {
            errors.push('Invalid stage ID');
        }

        if (attempt.score < 0 || attempt.score > 1) {
            errors.push('Score must be between 0 and 1');
        }

        return { isValid: errors.length === 0, errors };
    }
};

// Error Handling Contracts

export interface ServiceError {
    code: ServiceErrorCode;
    message: string;
    context?: Record<string, unknown>;
    timestamp: Date;
}

export type ServiceErrorCode =
    | 'STORAGE_UNAVAILABLE'
    | 'STORAGE_QUOTA_EXCEEDED'
    | 'INVALID_STAGE_ID'
    | 'INVALID_MODULE_ID'
    | 'QUIZ_NOT_FOUND'
    | 'QUIZ_ALREADY_COMPLETED'
    | 'PREREQUISITES_NOT_MET'
    | 'VALIDATION_FAILED'
    | 'SESSION_EXPIRED'
    | 'CONTENT_VERSION_MISMATCH';

export interface ErrorHandler {
    handleStorageError(error: ServiceError): void;
    handleValidationError(error: ServiceError, fallback?: () => void): void;
    handleQuizError(error: ServiceError): void;
    logError(error: ServiceError): void;
}

// Type Guards and Utilities

export const isValidStageId = (id: string): id is StageId => {
    return ['foundations', 'architecture-messages', 'advanced-patterns', 'building-debugging', 'mastery'].includes(id);
};

export const isValidModuleId = (id: string): id is ModuleId => {
    return typeof id === 'string' && id.includes('-') && id.split('-').length >= 2;
};

export const isValidConceptId = (id: string): id is ConceptId => {
    return typeof id === 'string' && id.length > 0;
};

export const generateSessionId = (): string => {
    return crypto.randomUUID ? crypto.randomUUID() :
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
};

export const calculateProgress = (completedStages: number, totalStages: number): number => {
    return totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100) / 100;
};

export const estimateTimeRemaining = (learner: Learner, stages: Stage[]): number => {
    const incompleteStages = stages.filter(stage =>
        learner.stageStatuses[stage.id] !== 'completed'
    );
    return incompleteStages.reduce((total, stage) => total + stage.estimatedMinutes, 0);
};

// Service Composition

export interface AppService {
    learner: LearnerService;
    quiz: QuizService;
    content: ContentService;
    analytics: AnalyticsService;
    feedback: FeedbackService;
    storage: StorageService;

    // Application lifecycle
    initialize(): Promise<void>;
    shutdown(): void;
    handleError(error: ServiceError): void;
}

export interface ServiceFactory {
    createLearnerService(): LearnerService;
    createQuizService(): QuizService;
    createContentService(): ContentService;
    createAnalyticsService(): AnalyticsService;
    createFeedbackService(): FeedbackService;
    createStorageService(): StorageService;
}