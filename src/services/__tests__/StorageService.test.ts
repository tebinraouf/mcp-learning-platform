/**
 * StorageService Unit Tests
 * 
 * Tests for sessionStorage wrapper functions
 */

import * as StorageService from '@/services/StorageService'
import type { Learner, ProgressRecord, FeedbackEntry } from '@/types'

describe('StorageService', () => {
    // Mock sessionStorage
    const mockSessionStorage = (() => {
        let store: Record<string, string> = {}
        return {
            getItem: jest.fn((key: string) => store[key] || null),
            setItem: jest.fn((key: string, value: string) => {
                store[key] = value
            }),
            removeItem: jest.fn((key: string) => {
                delete store[key]
            }),
            clear: jest.fn(() => {
                store = {}
            }),
            get length() {
                return Object.keys(store).length
            },
            key: jest.fn((index: number) => Object.keys(store)[index] || null),
        }
    })()

    beforeAll(() => {
        Object.defineProperty(window, 'sessionStorage', {
            value: mockSessionStorage,
            writable: true,
        })
    })

    beforeEach(() => {
        mockSessionStorage.clear()
    })

    describe('Learner Operations', () => {
        const mockLearner: Learner = {
            sessionId: 'session-123',
            stageStatuses: {
                'foundations': 'in-progress',
                'architecture-messages': 'locked',
                'advanced-patterns': 'locked',
                'building-debugging': 'locked',
                'mastery': 'locked',
            },
            quizAttempts: [],
            moduleCompletions: {},
            preferences: {
                theme: 'light',
            },
            sessionCounters: {
                stageStarts: {},
                quizAttempts: {},
                quizPasses: {},
                moduleViews: {},
                sessionDuration: 0,
                interactionCount: 0,
            },
        }

        it('should save and retrieve learner', () => {
            StorageService.saveLearner(mockLearner)
            const retrieved = StorageService.getLearner()

            expect(retrieved).toEqual(mockLearner)
        })

        it('should return null when no learner exists', () => {
            const retrieved = StorageService.getLearner()
            expect(retrieved).toBeNull()
        })

        it('should check if learner exists', () => {
            expect(StorageService.hasLearner()).toBe(false)

            StorageService.saveLearner(mockLearner)
            expect(StorageService.hasLearner()).toBe(true)
        })
    })

    describe('Progress Operations', () => {
        const mockProgress: ProgressRecord[] = [
            {
                id: 'progress-1',
                learnerId: 'learner-123',
                stageId: 'stage-1',
                moduleId: 'module-1',
                completed: true,
                score: 85,
                timeSpentMs: 120000,
                timestamp: '2025-01-01T12:00:00.000Z',
            },
            {
                id: 'progress-2',
                learnerId: 'learner-123',
                stageId: 'stage-1',
                moduleId: 'module-2',
                completed: false,
                timeSpentMs: 60000,
                timestamp: '2025-01-01T12:30:00.000Z',
            },
        ]

        it('should save and retrieve progress', () => {
            StorageService.saveProgress(mockProgress)
            const retrieved = StorageService.getProgress()

            expect(retrieved).toEqual(mockProgress)
        })

        it('should return empty array when no progress exists', () => {
            const retrieved = StorageService.getProgress()
            expect(retrieved).toEqual([])
        })
    })

    describe('Feedback Operations', () => {
        const mockFeedback: FeedbackEntry[] = [
            {
                id: 'feedback-1',
                learnerId: 'learner-123',
                moduleId: 'module-1',
                rating: 5,
                comment: 'Great content!',
                timestamp: '2025-01-01T13:00:00.000Z',
            },
            {
                id: 'feedback-2',
                learnerId: 'learner-123',
                moduleId: 'module-2',
                rating: 4,
                timestamp: '2025-01-01T14:00:00.000Z',
            },
        ]

        it('should save and retrieve feedback', () => {
            StorageService.saveFeedback(mockFeedback)
            const retrieved = StorageService.getFeedback()

            expect(retrieved).toEqual(mockFeedback)
        })

        it('should return empty array when no feedback exists', () => {
            const retrieved = StorageService.getFeedback()
            expect(retrieved).toEqual([])
        })
    })

    describe('Session Operations', () => {
        it('should save and retrieve session start time', () => {
            const timestamp = '2025-01-01T10:00:00.000Z'

            StorageService.saveSessionStart(timestamp)
            const retrieved = StorageService.getSessionStart()

            expect(retrieved).toBe(timestamp)
        })

        it('should return null when no session start exists', () => {
            const retrieved = StorageService.getSessionStart()
            expect(retrieved).toBeNull()
        })
    })

    describe('Clear Operations', () => {
        it('should clear all storage', () => {
            const mockLearner: Learner = {
                id: 'learner-123',
                name: 'Test',
                email: 'test@example.com',
                currentStageId: 'stage-1',
                completedStages: [],
                weakConcepts: [],
                strongConcepts: [],
                createdAt: '2025-01-01T00:00:00.000Z',
            }

            StorageService.saveLearner(mockLearner)
            StorageService.saveProgress([])
            StorageService.saveFeedback([])
            StorageService.saveSessionStart('2025-01-01T10:00:00.000Z')

            StorageService.clearAllStorage()

            expect(StorageService.getLearner()).toBeNull()
            expect(StorageService.getProgress()).toEqual([])
            expect(StorageService.getFeedback()).toEqual([])
            expect(StorageService.getSessionStart()).toBeNull()
        })
    })

    describe('Storage Size', () => {
        it('should calculate storage size in bytes', () => {
            const mockLearner: Learner = {
                id: 'learner-123',
                name: 'Test Learner',
                email: 'test@example.com',
                currentStageId: 'stage-1',
                completedStages: [],
                weakConcepts: [],
                strongConcepts: [],
                createdAt: '2025-01-01T00:00:00.000Z',
            }

            StorageService.saveLearner(mockLearner)
            const size = StorageService.getStorageSize()

            expect(size).toBeGreaterThan(0)
        })

        it('should return 0 for empty storage', () => {
            const size = StorageService.getStorageSize()
            expect(size).toBe(0)
        })
    })

    describe('Error Handling', () => {
        it('should handle JSON parse errors gracefully for learner', () => {
            mockSessionStorage.setItem('mcp-learner', '{invalid json}')
            const learner = StorageService.getLearner()
            expect(learner).toBeNull()
        })

        it('should handle JSON parse errors gracefully for progress', () => {
            mockSessionStorage.setItem('mcp-progress', '{invalid json}')
            const progress = StorageService.getProgress()
            expect(progress).toEqual([])
        })

        it('should handle JSON parse errors gracefully for feedback', () => {
            mockSessionStorage.setItem('mcp-feedback', '{invalid json}')
            const feedback = StorageService.getFeedback()
            expect(feedback).toEqual([])
        })
    })
})
