import type { Learner } from '@/types'

/**
 * Calculate mastery percentage from quiz attempts
 * Formula: (totalCorrectAnswers / totalQuestionsAnswered) * 100
 * 
 * @param learner - Learner object containing quiz attempts
 * @returns Mastery percentage (0-100)
 */
export function calculateMastery(learner: Learner): number {
    const quizAttempts = learner.quizAttempts || []

    if (quizAttempts.length === 0) {
        return 0
    }

    let totalCorrect = 0
    let totalQuestions = 0

    quizAttempts.forEach((attempt) => {
        attempt.answers.forEach((answer) => {
            totalQuestions++
            if (answer.isCorrect) {
                totalCorrect++
            }
        })
    })

    if (totalQuestions === 0) {
        return 0
    }

    const accuracy = (totalCorrect / totalQuestions) * 100
    return Math.round(accuracy)
}

export type MasteryLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master'

/**
 * Classify mastery percentage into levels
 * - Beginner: 0-40%
 * - Intermediate: 41-70%
 * - Advanced: 71-89%
 * - Master: 90-100%
 * 
 * @param percentage - Mastery percentage (0-100)
 * @returns Mastery level classification
 */
export function getMasteryLevel(percentage: number): MasteryLevel {
    if (percentage <= 40) return 'Beginner'
    if (percentage <= 70) return 'Intermediate'
    if (percentage <= 89) return 'Advanced'
    return 'Master'
}
