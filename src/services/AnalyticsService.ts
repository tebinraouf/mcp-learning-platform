/**
 * AnalyticsService - Track session metrics and user interactions
 */

import type { StageId } from '@/types'
import * as LearnerService from './LearnerService'
import * as QuizService from './QuizService'
import * as FeedbackService from './FeedbackService'
import * as ContentService from './ContentService'

/**
 * Get comprehensive session analytics
 */
export function getSessionAnalytics() {
    const learner = LearnerService.getLearner()
    const progress = LearnerService.getProgressSummary()
    const feedbackStats = FeedbackService.getFeedbackStats()

    return {
        sessionId: learner.sessionId,
        duration: progress.sessionDurationMinutes,
        completedStages: progress.completedStages,
        totalStages: progress.totalStages,
        overallProgress: progress.percentComplete,
        interactions: learner.sessionCounters.interactionCount,
        feedbackCount: feedbackStats.total,
        sentiment: feedbackStats.sentiment,
    }
}

/**
 * Get stage analytics
 */
export function getStageAnalytics(stageId: StageId) {
    const learner = LearnerService.getLearner()
    const stage = ContentService.getStage(stageId)
    const quizStats = QuizService.getQuizStats(stageId)

    if (!stage) {
        throw new Error(`Stage not found: ${stageId}`)
    }

    const modules = stage.modules
    const completedModules = modules.filter(
        (m) => learner.moduleCompletions[m.id] === true
    ).length

    return {
        stageId,
        stageName: stage.name,
        status: learner.stageStatuses[stageId],
        starts: learner.sessionCounters.stageStarts[stageId],
        moduleCompletion: modules.length > 0 ? completedModules / modules.length : 0,
        completedModules,
        totalModules: modules.length,
        quizAttempts: learner.sessionCounters.quizAttempts[stageId],
        quizPasses: learner.sessionCounters.quizPasses[stageId],
        quizBestScore: quizStats.bestScore,
        quizAverageScore: quizStats.averageScore,
    }
}

/**
 * Get all stages analytics
 */
export function getAllStagesAnalytics() {
    const stages = ContentService.getAllStages()
    return stages.map((stage) => getStageAnalytics(stage.id))
}

/**
 * Get learning velocity (stages completed per hour)
 */
export function getLearningVelocity(): number {
    const progress = LearnerService.getProgressSummary()
    const hoursSpent = progress.sessionDurationMinutes / 60

    if (hoursSpent === 0) return 0

    return progress.completedStages / hoursSpent
}

/**
 * Get estimated completion time
 */
export function getEstimatedCompletionTime(): number {
    const remainingTime = ContentService.getRemainingEstimatedTime()
    const velocity = getLearningVelocity()

    if (velocity === 0) {
        return remainingTime // Return estimated time if no velocity data
    }

    // Adjust based on actual velocity
    const completedStages = LearnerService.getCompletedStages().length
    if (completedStages === 0) {
        return remainingTime
    }

    const actualTimePerStage = LearnerService.getSessionDurationMinutes() / completedStages
    const remainingStages = 5 - completedStages

    return actualTimePerStage * remainingStages
}

/**
 * Get quiz performance summary
 */
export function getQuizPerformanceSummary() {
    const learner = LearnerService.getLearner()
    const totalAttempts = Object.values(learner.sessionCounters.quizAttempts).reduce(
        (sum, count) => sum + count,
        0
    )
    const totalPasses = Object.values(learner.sessionCounters.quizPasses).reduce(
        (sum, count) => sum + count,
        0
    )

    const stages = ContentService.getAllStages()
    const stageScores = stages.map((stage) => {
        const stats = QuizService.getQuizStats(stage.id)
        return stats.bestScore
    })

    const averageScore =
        stageScores.length > 0
            ? stageScores.reduce((sum, score) => sum + score, 0) / stageScores.length
            : 0

    return {
        totalAttempts,
        totalPasses,
        passRate: totalAttempts > 0 ? totalPasses / totalAttempts : 0,
        averageScore,
    }
}

/**
 * Get engagement metrics
 */
export function getEngagementMetrics() {
    const learner = LearnerService.getLearner()
    const progress = LearnerService.getProgressSummary()
    const feedbackStats = FeedbackService.getFeedbackStats()

    const totalModules = ContentService.getAllStages().reduce(
        (sum, stage) => sum + stage.modules.length,
        0
    )
    const completedModules = Object.values(learner.moduleCompletions).filter(
        Boolean
    ).length

    return {
        sessionDuration: progress.sessionDurationMinutes,
        interactionCount: learner.sessionCounters.interactionCount,
        moduleCompletionRate: totalModules > 0 ? completedModules / totalModules : 0,
        feedbackProvided: feedbackStats.total,
        averageInteractionsPerMinute:
            progress.sessionDurationMinutes > 0
                ? learner.sessionCounters.interactionCount / progress.sessionDurationMinutes
                : 0,
    }
}

/**
 * Get progress milestones
 */
export function getProgressMilestones() {
    const progress = LearnerService.getProgressSummary()
    const milestones = []

    if (progress.completedStages >= 1) {
        milestones.push({ name: 'First Stage Complete', achieved: true })
    }

    if (progress.completedStages >= 3) {
        milestones.push({ name: 'Halfway There', achieved: true })
    }

    if (progress.completedStages >= 5) {
        milestones.push({ name: 'Master Achieved', achieved: true })
    }

    const quizPerf = getQuizPerformanceSummary()
    if (quizPerf.totalPasses >= 3) {
        milestones.push({ name: 'Quiz Expert', achieved: true })
    }

    if (progress.sessionDurationMinutes >= 60) {
        milestones.push({ name: '1 Hour Dedication', achieved: true })
    }

    if (progress.sessionDurationMinutes >= 180) {
        milestones.push({ name: '3 Hours of Learning', achieved: true })
    }

    return milestones
}

/**
 * Export analytics summary for debugging or export
 */
export function exportAnalyticsSummary() {
    return {
        session: getSessionAnalytics(),
        stages: getAllStagesAnalytics(),
        quiz: getQuizPerformanceSummary(),
        engagement: getEngagementMetrics(),
        milestones: getProgressMilestones(),
        estimatedCompletion: getEstimatedCompletionTime(),
        learningVelocity: getLearningVelocity(),
        timestamp: new Date().toISOString(),
    }
}
