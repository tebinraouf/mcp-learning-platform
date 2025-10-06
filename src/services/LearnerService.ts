/**
 * LearnerService - Manage learner profile and session state
 */

import type { Learner, StageId, StageStatus, ModuleId } from '@/types'
import * as StorageService from './StorageService'
import { v4 as uuidv4 } from 'uuid'

/**
 * Initialize or get existing learner
 */
export function initializeLearner(): Learner {
    const existing = StorageService.getLearner()

    if (existing) {
        return existing
    }

    // Create new learner with default state
    const learner: Learner = {
        sessionId: uuidv4(),
        stageStatuses: {
            foundations: 'locked',
            'architecture-messages': 'locked',
            'advanced-patterns': 'locked',
            'building-debugging': 'locked',
            mastery: 'locked',
        },
        quizAttempts: [],
        moduleCompletions: {},
        preferences: {},
        sessionCounters: {
            stageStarts: {
                foundations: 0,
                'architecture-messages': 0,
                'advanced-patterns': 0,
                'building-debugging': 0,
                mastery: 0,
            },
            quizAttempts: {
                foundations: 0,
                'architecture-messages': 0,
                'advanced-patterns': 0,
                'building-debugging': 0,
                mastery: 0,
            },
            quizPasses: {
                foundations: 0,
                'architecture-messages': 0,
                'advanced-patterns': 0,
                'building-debugging': 0,
                mastery: 0,
            },
            moduleViews: {},
            sessionDuration: 0,
            interactionCount: 0,
        },
    }

    // First stage starts unlocked
    learner.stageStatuses.foundations = 'in-progress'

    StorageService.saveLearner(learner)
    StorageService.saveSessionStart(new Date().toISOString())

    return learner
}

/**
 * Get current learner (throws if not found)
 */
export function getLearner(): Learner {
    const learner = StorageService.getLearner()
    if (!learner) {
        throw new Error('Learner not found. Please initialize session.')
    }
    return learner
}

/**
 * Update learner profile
 */
export function updateLearner(updates: Partial<Learner>): Learner {
    const current = getLearner()
    const updated: Learner = { ...current, ...updates }
    StorageService.saveLearner(updated)
    return updated
}

/**
 * Start a stage
 */
export function startStage(stageId: StageId): Learner {
    const current = getLearner()

    return updateLearner({
        stageStatuses: {
            ...current.stageStatuses,
            [stageId]: 'in-progress',
        },
        sessionCounters: {
            ...current.sessionCounters,
            stageStarts: {
                ...current.sessionCounters.stageStarts,
                [stageId]: current.sessionCounters.stageStarts[stageId] + 1,
            },
        },
    })
}

/**
 * Mark stage as completed and unlock next stage
 */
export function completeStage(stageId: StageId, nextStageId?: StageId): Learner {
    const current = getLearner()

    const updatedStatuses: Record<StageId, StageStatus> = {
        ...current.stageStatuses,
        [stageId]: 'completed',
    }

    // Unlock next stage if provided (automatic progression)
    if (nextStageId) {
        updatedStatuses[nextStageId] = 'in-progress'
    }

    return updateLearner({
        stageStatuses: updatedStatuses,
    })
}

/**
 * Mark a module as completed
 */
export function completeModule(moduleId: ModuleId): Learner {
    const current = getLearner()

    return updateLearner({
        moduleCompletions: {
            ...current.moduleCompletions,
            [moduleId]: true,
        },
        sessionCounters: {
            ...current.sessionCounters,
            moduleViews: {
                ...current.sessionCounters.moduleViews,
                [moduleId]: (current.sessionCounters.moduleViews[moduleId] || 0) + 1,
            },
        },
    })
}

/**
 * Increment interaction counter
 */
export function incrementInteractions(): Learner {
    const current = getLearner()

    return updateLearner({
        sessionCounters: {
            ...current.sessionCounters,
            interactionCount: current.sessionCounters.interactionCount + 1,
        },
    })
}

/**
 * Update session duration
 */
export function updateSessionDuration(): Learner {
    const sessionStart = StorageService.getSessionStart()
    if (!sessionStart) return getLearner()

    const start = new Date(sessionStart)
    const now = new Date()
    const duration = now.getTime() - start.getTime()

    const current = getLearner()

    return updateLearner({
        sessionCounters: {
            ...current.sessionCounters,
            sessionDuration: duration,
        },
    })
}

/**
 * Get session duration in milliseconds
 */
export function getSessionDuration(): number {
    const learner = getLearner()
    return learner.sessionCounters.sessionDuration
}

/**
 * Get session duration in minutes
 */
export function getSessionDurationMinutes(): number {
    return Math.floor(getSessionDuration() / 1000 / 60)
}

/**
 * Calculate overall progress percentage (0-100)
 */
export function calculateOverallProgress(): number {
    const learner = getLearner()
    const completedCount = Object.values(learner.stageStatuses).filter(
        (status) => status === 'completed'
    ).length
    const totalStages = 5
    return (completedCount / totalStages) * 100
}

/**
 * Get completed stages
 */
export function getCompletedStages(): StageId[] {
    const learner = getLearner()
    return Object.entries(learner.stageStatuses)
        .filter(([, status]) => status === 'completed')
        .map(([stageId]) => stageId as StageId)
}

/**
 * Get current stage (in-progress)
 */
export function getCurrentStage(): StageId | null {
    const learner = getLearner()
    const current = Object.entries(learner.stageStatuses).find(
        ([, status]) => status === 'in-progress'
    )
    return current ? (current[0] as StageId) : null
}

/**
 * Reset learner session (for debugging or restart)
 */
export function resetSession(): void {
    StorageService.clearAllStorage()
}

/**
 * Check if learner has completed specific stage
 */
export function hasCompletedStage(stageId: StageId): boolean {
    const learner = getLearner()
    return learner.stageStatuses[stageId] === 'completed'
}

/**
 * Get stage status
 */
export function getStageStatus(stageId: StageId): StageStatus {
    const learner = getLearner()
    return learner.stageStatuses[stageId]
}

/**
 * Get progress summary
 */
export function getProgressSummary() {
    const learner = getLearner()
    const completedStages = getCompletedStages()
    const currentStage = getCurrentStage()

    return {
        sessionId: learner.sessionId,
        completedStages: completedStages.length,
        totalStages: 5,
        percentComplete: calculateOverallProgress(),
        currentStageId: currentStage,
        sessionDuration: getSessionDuration(),
        sessionDurationMinutes: getSessionDurationMinutes(),
        interactionCount: learner.sessionCounters.interactionCount,
        stageStatuses: learner.stageStatuses,
    }
}
