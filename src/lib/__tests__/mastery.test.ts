import { calculateMastery, getMasteryLevel } from '../mastery'
import type { Learner, StageId } from '@/types'

const createMockLearner = (quizAttempts: Learner['quizAttempts'] = []): Learner => ({
    sessionId: 'test-session',
    stageStatuses: {} as Record<StageId, 'locked' | 'in-progress' | 'completed'>,
    quizAttempts,
    moduleCompletions: {},
    preferences: {},
    sessionCounters: {
        stageStarts: {} as Record<StageId, number>,
        quizAttempts: {} as Record<StageId, number>,
        quizPasses: {} as Record<StageId, number>,
        moduleViews: {},
        sessionDuration: 0,
        interactionCount: 0,
    },
})

describe('calculateMastery', () => {
    it('returns 0 when no quiz attempts exist', () => {
        const learner = createMockLearner([])
        expect(calculateMastery(learner)).toBe(0)
    })

    it('returns 0 when quiz attempts have no answers (division by zero)', () => {
        const learner = createMockLearner([
            {
                id: '1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [],
                score: 0,
                passed: false,
            },
        ])
        expect(calculateMastery(learner)).toBe(0)
    })

    it('calculates accuracy percentage correctly', () => {
        const learner = createMockLearner([
            {
                id: '1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: true },
                    { questionId: 'q3', selectedOptionId: 'c', isCorrect: false },
                    { questionId: 'q4', selectedOptionId: 'd', isCorrect: true },
                    { questionId: 'q5', selectedOptionId: 'e', isCorrect: true },
                ],
                score: 0.8,
                passed: true,
            },
        ])
        // 4 correct out of 5 = 80%
        expect(calculateMastery(learner)).toBe(80)
    })

    it('rounds to whole number', () => {
        const learner = createMockLearner([
            {
                id: '1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: true },
                    { questionId: 'q3', selectedOptionId: 'c', isCorrect: false },
                ],
                score: 0.67,
                passed: true,
            },
        ])
        // 2 correct out of 3 = 66.666... → 67%
        expect(calculateMastery(learner)).toBe(67)
    })

    it('handles 100% accuracy', () => {
        const learner = createMockLearner([
            {
                id: '1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: true },
                    { questionId: 'q3', selectedOptionId: 'c', isCorrect: true },
                    { questionId: 'q4', selectedOptionId: 'd', isCorrect: true },
                    { questionId: 'q5', selectedOptionId: 'e', isCorrect: true },
                ],
                score: 1.0,
                passed: true,
            },
        ])
        expect(calculateMastery(learner)).toBe(100)
    })

    it('handles 0% accuracy', () => {
        const learner = createMockLearner([
            {
                id: '1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: false },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: false },
                    { questionId: 'q3', selectedOptionId: 'c', isCorrect: false },
                    { questionId: 'q4', selectedOptionId: 'd', isCorrect: false },
                    { questionId: 'q5', selectedOptionId: 'e', isCorrect: false },
                ],
                score: 0,
                passed: false,
            },
        ])
        expect(calculateMastery(learner)).toBe(0)
    })

    it('aggregates across multiple quiz attempts', () => {
        const learner = createMockLearner([
            {
                id: '1',
                quizId: 'quiz-1',
                stageId: 'foundations',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q1', selectedOptionId: 'a', isCorrect: true },
                    { questionId: 'q2', selectedOptionId: 'b', isCorrect: false },
                ],
                score: 0.5,
                passed: false,
            },
            {
                id: '2',
                quizId: 'quiz-2',
                stageId: 'architecture-messages',
                timestamp: new Date(),
                answers: [
                    { questionId: 'q3', selectedOptionId: 'c', isCorrect: true },
                    { questionId: 'q4', selectedOptionId: 'd', isCorrect: true },
                    { questionId: 'q5', selectedOptionId: 'e', isCorrect: true },
                ],
                score: 1.0,
                passed: true,
            },
        ])
        // 4 correct out of 5 total = 80%
        expect(calculateMastery(learner)).toBe(80)
    })
})

describe('getMasteryLevel', () => {
    it('returns "Beginner" for 0-40%', () => {
        expect(getMasteryLevel(0)).toBe('Beginner')
        expect(getMasteryLevel(25)).toBe('Beginner')
        expect(getMasteryLevel(40)).toBe('Beginner')
    })

    it('returns "Intermediate" for 41-70%', () => {
        expect(getMasteryLevel(41)).toBe('Intermediate')
        expect(getMasteryLevel(55)).toBe('Intermediate')
        expect(getMasteryLevel(70)).toBe('Intermediate')
    })

    it('returns "Advanced" for 71-89%', () => {
        expect(getMasteryLevel(71)).toBe('Advanced')
        expect(getMasteryLevel(80)).toBe('Advanced')
        expect(getMasteryLevel(89)).toBe('Advanced')
    })

    it('returns "Master" for 90-100%', () => {
        expect(getMasteryLevel(90)).toBe('Master')
        expect(getMasteryLevel(95)).toBe('Master')
        expect(getMasteryLevel(100)).toBe('Master')
    })
})
