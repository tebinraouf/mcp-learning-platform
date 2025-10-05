/**
 * QuizService - Handle quiz attempts, scoring, and validation
 */

import type { Quiz, QuizAttempt, QuizAnswer, StageId } from '@/types'
import * as LearnerService from './LearnerService'
import { v4 as uuidv4 } from 'uuid'

/**
 * Start a new quiz attempt
 */
export function startQuizAttempt(quiz: Quiz): QuizAttempt {
    const learner = LearnerService.getLearner()

    const attempt: QuizAttempt = {
        id: uuidv4(),
        quizId: quiz.id,
        stageId: quiz.stageId,
        timestamp: new Date(),
        answers: [],
        score: 0,
        passed: false,
    }

    // Increment quiz attempt counter
    const updatedCounters = {
        ...learner.sessionCounters,
        quizAttempts: {
            ...learner.sessionCounters.quizAttempts,
            [quiz.stageId]:
                learner.sessionCounters.quizAttempts[quiz.stageId] + 1,
        },
    }

    LearnerService.updateLearner({
        sessionCounters: updatedCounters,
    })

    return attempt
}

/**
 * Submit an answer to a quiz question
 */
export function submitAnswer(
    attempt: QuizAttempt,
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean,
    timeSpent?: number
): QuizAttempt {
    const answer: QuizAnswer = {
        questionId,
        selectedOptionId,
        isCorrect,
        timeSpent,
    }

    return {
        ...attempt,
        answers: [...attempt.answers, answer],
    }
}

/**
 * Complete a quiz attempt and calculate score
 */
export function completeQuizAttempt(
    attempt: QuizAttempt,
    quiz: Quiz
): QuizAttempt {
    const totalQuestions = quiz.questions.length
    const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length
    const score = correctAnswers / totalQuestions
    const passed = score >= quiz.passingThreshold

    const completedAttempt: QuizAttempt = {
        ...attempt,
        score,
        passed,
        completedAt: new Date(),
    }

    // Save attempt to learner
    const learner = LearnerService.getLearner()
    const updatedAttempts = [...learner.quizAttempts, completedAttempt]

    let updatedCounters = { ...learner.sessionCounters }

    // Increment pass counter if passed
    if (passed) {
        updatedCounters = {
            ...updatedCounters,
            quizPasses: {
                ...updatedCounters.quizPasses,
                [quiz.stageId]: updatedCounters.quizPasses[quiz.stageId] + 1,
            },
        }
    }

    LearnerService.updateLearner({
        quizAttempts: updatedAttempts,
        sessionCounters: updatedCounters,
    })

    return completedAttempt
}

/**
 * Get all quiz attempts for a stage
 */
export function getStageQuizAttempts(stageId: StageId): QuizAttempt[] {
    const learner = LearnerService.getLearner()
    return learner.quizAttempts.filter((attempt) => attempt.stageId === stageId)
}

/**
 * Get best quiz score for a stage
 */
export function getBestScore(stageId: StageId): number {
    const attempts = getStageQuizAttempts(stageId)
    if (attempts.length === 0) return 0

    return Math.max(...attempts.map((a) => a.score))
}

/**
 * Get latest quiz attempt for a stage
 */
export function getLatestAttempt(stageId: StageId): QuizAttempt | null {
    const attempts = getStageQuizAttempts(stageId)
    if (attempts.length === 0) return null

    return attempts.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    )
}

/**
 * Check if learner has passed the quiz for a stage
 */
export function hasPassedQuiz(stageId: StageId): boolean {
    const attempts = getStageQuizAttempts(stageId)
    return attempts.some((attempt) => attempt.passed)
}

/**
 * Get quiz attempt statistics for a stage
 */
export function getQuizStats(stageId: StageId) {
    const attempts = getStageQuizAttempts(stageId)

    if (attempts.length === 0) {
        return {
            totalAttempts: 0,
            bestScore: 0,
            averageScore: 0,
            passed: false,
            passedOnAttempt: null,
        }
    }

    const scores = attempts.map((a) => a.score)
    const bestScore = Math.max(...scores)
    const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length

    const passedAttempt = attempts.findIndex((a) => a.passed)
    const passedOnAttempt = passedAttempt !== -1 ? passedAttempt + 1 : null

    return {
        totalAttempts: attempts.length,
        bestScore,
        averageScore,
        passed: hasPassedQuiz(stageId),
        passedOnAttempt,
    }
}

/**
 * Validate quiz attempt (check all questions answered)
 */
export function validateQuizAttempt(
    attempt: QuizAttempt,
    quiz: Quiz
): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (attempt.answers.length !== quiz.questions.length) {
        errors.push(
            `Incomplete quiz: ${attempt.answers.length}/${quiz.questions.length} questions answered`
        )
    }

    const answeredQuestionIds = new Set(attempt.answers.map((a) => a.questionId))

    quiz.questions.forEach((q) => {
        if (!answeredQuestionIds.has(q.id)) {
            errors.push(`Question not answered: ${q.id}`)
        }
    })

    return {
        valid: errors.length === 0,
        errors,
    }
}

/**
 * Get percentage of correctly answered questions by concept
 */
export function getConceptAccuracy(stageId: StageId, quiz: Quiz) {
    const attempts = getStageQuizAttempts(stageId)
    if (attempts.length === 0) return {}

    const conceptStats: Record<
        string,
        { correct: number; total: number; accuracy: number }
    > = {}

    attempts.forEach((attempt) => {
        attempt.answers.forEach((answer) => {
            const question = quiz.questions.find((q) => q.id === answer.questionId)
            if (!question) return

            const concept = question.conceptTag

            if (!conceptStats[concept]) {
                conceptStats[concept] = { correct: 0, total: 0, accuracy: 0 }
            }

            conceptStats[concept].total++
            if (answer.isCorrect) {
                conceptStats[concept].correct++
            }
        })
    })

    // Calculate accuracy percentages
    Object.keys(conceptStats).forEach((concept) => {
        const stats = conceptStats[concept]
        stats.accuracy = stats.total > 0 ? stats.correct / stats.total : 0
    })

    return conceptStats
}

/**
 * Get weak concepts (< 50% accuracy)
 */
export function getWeakConcepts(stageId: StageId, quiz: Quiz): string[] {
    const conceptAccuracy = getConceptAccuracy(stageId, quiz)
    return Object.entries(conceptAccuracy)
        .filter(([, stats]) => stats.accuracy < 0.5)
        .map(([concept]) => concept)
}

/**
 * Get average time spent per question
 */
export function getAverageTimePerQuestion(attempt: QuizAttempt): number {
    const answersWithTime = attempt.answers.filter((a) => a.timeSpent !== undefined)
    if (answersWithTime.length === 0) return 0

    const totalTime = answersWithTime.reduce(
        (sum, a) => sum + (a.timeSpent || 0),
        0
    )
    return totalTime / answersWithTime.length
}
