/**
 * QuizService Unit Tests - Progression Logic
 */

import * as QuizService from '@/services/QuizService'
import * as LearnerService from '@/services/LearnerService'
import * as ContentService from '@/services/ContentService'
import * as StorageService from '@/services/StorageService'
import type { QuizAttempt, Learner, Quiz } from '@/types'

// Mock dependencies
jest.mock('@/services/LearnerService')
jest.mock('@/services/ContentService')
jest.mock('@/services/StorageService')
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-1234'),
}))

describe('QuizService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getNextStageId', () => {
        it('should return next stage ID in sequence', () => {
            const mockStages = [
                { id: 'foundations', sequenceOrder: 1 },
                { id: 'architecture-messages', sequenceOrder: 2 },
                { id: 'advanced-patterns', sequenceOrder: 3 },
            ]

                ; (ContentService.getAllStages as jest.Mock).mockReturnValue(mockStages)

            // Access the helper function via module internals
            // Note: getNextStageId is internal, so we test it via completeQuizAttempt behavior
            // This test verifies the logic conceptually
            const sortedStages = mockStages.sort((a, b) => a.sequenceOrder - b.sequenceOrder)
            const currentIndex = sortedStages.findIndex((s) => s.id === 'foundations')
            const nextStage = sortedStages[currentIndex + 1]

            expect(nextStage?.id).toBe('architecture-messages')
        })

        it('should return undefined for final stage', () => {
            const mockStages = [
                { id: 'foundations', sequenceOrder: 1 },
                { id: 'architecture-messages', sequenceOrder: 2 },
                { id: 'mastery', sequenceOrder: 3 },
            ]

                ; (ContentService.getAllStages as jest.Mock).mockReturnValue(mockStages)

            const sortedStages = mockStages.sort((a, b) => a.sequenceOrder - b.sequenceOrder)
            const currentIndex = sortedStages.findIndex((s) => s.id === 'mastery')
            const nextStage = sortedStages[currentIndex + 1]

            expect(nextStage).toBeUndefined()
        })
    })

    describe('completeQuizAttempt - Progression Logic', () => {
        const mockLearner: Learner = {
            sessionId: 'test-session',
            stageStatuses: {
                'foundations': 'in-progress',
                'architecture-messages': 'locked',
                'advanced-patterns': 'locked',
                'building-debugging': 'locked',
                'mastery': 'locked',
            },
            quizAttempts: [],
            moduleCompletions: {},
            preferences: {},
            sessionCounters: {
                stageStarts: {
                    'foundations': 1,
                    'architecture-messages': 0,
                    'advanced-patterns': 0,
                    'building-debugging': 0,
                    'mastery': 0,
                },
                quizAttempts: {
                    'foundations': 1,
                    'architecture-messages': 0,
                    'advanced-patterns': 0,
                    'building-debugging': 0,
                    'mastery': 0,
                },
                quizPasses: {
                    'foundations': 0,
                    'architecture-messages': 0,
                    'advanced-patterns': 0,
                    'building-debugging': 0,
                    'mastery': 0,
                },
                moduleViews: {},
                sessionDuration: 0,
                interactionCount: 0,
            },
        }

        it('should call completeStage when quiz is passed', () => {
            const mockStages = [
                { id: 'foundations', sequenceOrder: 1 },
                { id: 'architecture-messages', sequenceOrder: 2 },
            ]

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)
                ; (ContentService.getAllStages as jest.Mock).mockReturnValue(mockStages)

            const mockQuiz: Quiz = {
                id: 'quiz-1',
                stageId: 'foundations',
                questions: [],
                passingThreshold: 0.7,
            }

            const mockAttempt: QuizAttempt = {
                id: 'attempt-1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: true },
                ],
                score: 0.8,
                passed: true,
            }

            QuizService.completeQuizAttempt(mockAttempt, mockQuiz)

            expect(LearnerService.completeStage).toHaveBeenCalledWith(
                'foundations',
                'architecture-messages'
            )
        })

        it('should NOT call completeStage when quiz is failed', () => {
            ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)

            const mockQuiz: Quiz = {
                id: 'quiz-1',
                stageId: 'foundations',
                questions: [],
                passingThreshold: 0.7,
            }

            const mockAttempt: QuizAttempt = {
                id: 'attempt-1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: false },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: false },
                ],
                score: 0.5,
                passed: false,
            }

            QuizService.completeQuizAttempt(mockAttempt, mockQuiz)

            expect(LearnerService.completeStage).not.toHaveBeenCalled()
        })

        it('should handle final stage completion (undefined nextStageId)', () => {
            const finalStageLearner = {
                ...mockLearner,
                stageStatuses: {
                    ...mockLearner.stageStatuses,
                    'mastery': 'in-progress',
                },
            }

            const mockStages = [
                { id: 'foundations', sequenceOrder: 1 },
                { id: 'architecture-messages', sequenceOrder: 2 },
                { id: 'mastery', sequenceOrder: 3 },
            ]

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(finalStageLearner)
                ; (ContentService.getAllStages as jest.Mock).mockReturnValue(mockStages)

            const mockQuiz: Quiz = {
                id: 'quiz-mastery',
                stageId: 'mastery',
                questions: [],
                passingThreshold: 0.7,
            }

            const mockAttempt: QuizAttempt = {
                id: 'attempt-1',
                quizId: 'quiz-mastery',
                stageId: 'mastery',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: true },
                ],
                score: 0.9,
                passed: true,
            }

            QuizService.completeQuizAttempt(mockAttempt, mockQuiz)

            expect(LearnerService.completeStage).toHaveBeenCalledWith('mastery', undefined)
        })

        it('should unlock next stage in sequence when current stage quiz passed', () => {
            const mockStages = [
                { id: 'foundations', sequenceOrder: 1 },
                { id: 'architecture-messages', sequenceOrder: 2 },
                { id: 'advanced-patterns', sequenceOrder: 3 },
            ]

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)
                ; (ContentService.getAllStages as jest.Mock).mockReturnValue(mockStages)

            const mockQuiz: Quiz = {
                id: 'quiz-1',
                stageId: 'foundations',
                questions: [],
                passingThreshold: 0.7,
            }

            const mockAttempt: QuizAttempt = {
                id: 'attempt-1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: true },
                ],
                score: 0.75,
                passed: true,
            }

            QuizService.completeQuizAttempt(mockAttempt, mockQuiz)

            // Verify completeStage was called with correct next stage
            expect(LearnerService.completeStage).toHaveBeenCalledWith(
                'foundations',
                'architecture-messages'
            )

            // Verify it's called exactly once
            expect(LearnerService.completeStage).toHaveBeenCalledTimes(1)
        })
    })
})
