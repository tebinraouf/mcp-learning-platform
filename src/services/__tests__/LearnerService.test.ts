/**
 * LearnerService Unit Tests
 */

import * as LearnerService from '@/services/LearnerService'
import type { Learner, StageId } from '@/types'

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-1234'),
}))

// Mock StorageService
jest.mock('@/services/StorageService', () => ({
    saveLearner: jest.fn(),
    getLearner: jest.fn(),
    hasLearner: jest.fn(),
    clearAllStorage: jest.fn(),
}))

import * as StorageService from '@/services/StorageService'

describe('LearnerService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('initializeLearner', () => {
        it('should create new learner when none exists', () => {
            (StorageService.hasLearner as jest.Mock).mockReturnValue(false)

            const learner = LearnerService.initializeLearner()

            expect(learner.sessionId).toBeTruthy()
            expect(learner.stageStatuses.foundations).toBe('in-progress')
            expect(learner.stageStatuses['architecture-messages']).toBe('locked')
            expect(learner.quizAttempts).toEqual([])
            expect(learner.moduleCompletions).toEqual({})
            expect(StorageService.saveLearner).toHaveBeenCalledWith(learner)
        })

        it('should return existing learner if one exists', () => {
            const existingLearner: Learner = {
                sessionId: 'existing-session',
                stageStatuses: {
                    'foundations': 'completed',
                    'architecture-messages': 'in-progress',
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
                        'architecture-messages': 1,
                        'advanced-patterns': 0,
                        'building-debugging': 0,
                        'mastery': 0,
                    },
                    quizAttempts: {
                        'foundations': 2,
                        'architecture-messages': 0,
                        'advanced-patterns': 0,
                        'building-debugging': 0,
                        'mastery': 0,
                    },
                    quizPasses: {
                        'foundations': 1,
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

                ; (StorageService.hasLearner as jest.Mock).mockReturnValue(true)
                ; (StorageService.getLearner as jest.Mock).mockReturnValue(existingLearner)

            const learner = LearnerService.initializeLearner()

            expect(learner).toEqual(existingLearner)
            expect(StorageService.saveLearner).not.toHaveBeenCalled()
        })
    })

    describe('getLearner', () => {
        it('should return learner from storage', () => {
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
                        'foundations': 0,
                        'architecture-messages': 0,
                        'advanced-patterns': 0,
                        'building-debugging': 0,
                        'mastery': 0,
                    },
                    quizAttempts: {
                        'foundations': 0,
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

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)

            const learner = LearnerService.getLearner()

            expect(learner).toEqual(mockLearner)
            expect(StorageService.getLearner).toHaveBeenCalled()
        })
    })

    describe('completeModule', () => {
        it('should mark module as completed', () => {
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
                        'foundations': 0,
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

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)

            LearnerService.completeModule('foundations-1')

            expect(StorageService.saveLearner).toHaveBeenCalledWith(
                expect.objectContaining({
                    moduleCompletions: {
                        'foundations-1': true,
                    },
                })
            )
        })
    })

    describe('completeStage', () => {
        it('should mark stage as completed and unlock next stage', () => {
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
                        'foundations': 1,
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

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)

            LearnerService.completeStage('foundations', 'architecture-messages')

            expect(StorageService.saveLearner).toHaveBeenCalledWith(
                expect.objectContaining({
                    stageStatuses: expect.objectContaining({
                        'foundations': 'completed',
                        'architecture-messages': 'in-progress',
                    }),
                })
            )
        })

        it('should handle final stage completion without next stage', () => {
            const mockLearner: Learner = {
                sessionId: 'test-session',
                stageStatuses: {
                    'foundations': 'completed',
                    'architecture-messages': 'completed',
                    'advanced-patterns': 'completed',
                    'building-debugging': 'completed',
                    'mastery': 'in-progress',
                },
                quizAttempts: [],
                moduleCompletions: {},
                preferences: {},
                sessionCounters: {
                    stageStarts: {
                        'foundations': 1,
                        'architecture-messages': 1,
                        'advanced-patterns': 1,
                        'building-debugging': 1,
                        'mastery': 1,
                    },
                    quizAttempts: {
                        'foundations': 1,
                        'architecture-messages': 1,
                        'advanced-patterns': 1,
                        'building-debugging': 1,
                        'mastery': 1,
                    },
                    quizPasses: {
                        'foundations': 1,
                        'architecture-messages': 1,
                        'advanced-patterns': 1,
                        'building-debugging': 1,
                        'mastery': 0,
                    },
                    moduleViews: {},
                    sessionDuration: 0,
                    interactionCount: 0,
                },
            }

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)

            LearnerService.completeStage('mastery', undefined)

            expect(StorageService.saveLearner).toHaveBeenCalledWith(
                expect.objectContaining({
                    stageStatuses: expect.objectContaining({
                        'mastery': 'completed',
                    }),
                })
            )
        })
    })

    describe('getSessionDurationMinutes', () => {
        it('should calculate session duration in minutes', () => {
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
                        'foundations': 0,
                        'architecture-messages': 0,
                        'advanced-patterns': 0,
                        'building-debugging': 0,
                        'mastery': 0,
                    },
                    quizAttempts: {
                        'foundations': 0,
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
                    sessionDuration: 120000, // 2 minutes in milliseconds
                    interactionCount: 0,
                },
            }

                ; (StorageService.getLearner as jest.Mock).mockReturnValue(mockLearner)

            const duration = LearnerService.getSessionDurationMinutes()

            expect(duration).toBe(2)
        })
    })
})
