/**
 * ContentService Unit Tests
 */

import * as ContentService from '@/services/ContentService'

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-1234'),
}))

describe('ContentService', () => {
    describe('getAllStages', () => {
        it('should return all 5 stages', () => {
            const stages = ContentService.getAllStages()

            expect(stages).toHaveLength(5)
            expect(stages[0].id).toBe('foundations')
            expect(stages[1].id).toBe('architecture-messages')
            expect(stages[2].id).toBe('advanced-patterns')
            expect(stages[3].id).toBe('building-debugging')
            expect(stages[4].id).toBe('mastery')
        })

        it('should have valid stage properties', () => {
            const stages = ContentService.getAllStages()

            stages.forEach((stage) => {
                expect(stage.id).toBeTruthy()
                expect(stage.name).toBeTruthy()
                expect(stage.description).toBeTruthy()
                expect(stage.objectives).toBeInstanceOf(Array)
                expect(stage.objectives.length).toBeGreaterThan(0)
                expect(stage.estimatedMinutes).toBeGreaterThan(0)
                expect(stage.requiredModules).toBeInstanceOf(Array)
                expect(stage.quizId).toBeTruthy()
            })
        })
    })

    describe('getStageById', () => {
        it('should return correct stage by id', () => {
            const stage = ContentService.getStageById('foundations')

            expect(stage).toBeDefined()
            expect(stage?.id).toBe('foundations')
            expect(stage?.name).toBe('MCP Foundations')
        })

        it('should return undefined for invalid stage id', () => {
            const stage = ContentService.getStageById('invalid-stage' as any)

            expect(stage).toBeUndefined()
        })
    })

    describe('getModulesByStage', () => {
        it('should return modules for a given stage', () => {
            const modules = ContentService.getModulesByStage('foundations')

            expect(modules).toBeInstanceOf(Array)
            expect(modules.length).toBeGreaterThan(0)
            modules.forEach((module) => {
                expect(module.id).toContain('foundations')
                expect(module.stageId).toBe('foundations')
            })
        })

        it('should return empty array for invalid stage', () => {
            const modules = ContentService.getModulesByStage('invalid-stage' as any)

            expect(modules).toEqual([])
        })
    })

    describe('getModuleById', () => {
        it('should return correct module by id', () => {
            const module = ContentService.getModuleById('foundations-1')

            expect(module).toBeDefined()
            expect(module?.id).toBe('foundations-1')
            expect(module?.stageId).toBe('foundations')
        })

        it('should return undefined for invalid module id', () => {
            const module = ContentService.getModuleById('invalid-module')

            expect(module).toBeUndefined()
        })
    })

    describe('getQuizByStage', () => {
        it('should return quiz for a given stage', () => {
            const quiz = ContentService.getQuizByStage('foundations')

            expect(quiz).toBeDefined()
            expect(quiz?.id).toContain('foundations')
            expect(quiz?.stageId).toBe('foundations')
            expect(quiz?.questions).toBeInstanceOf(Array)
            expect(quiz?.questions.length).toBeGreaterThan(0)
        })

        it('should return undefined for invalid stage', () => {
            const quiz = ContentService.getQuizByStage('invalid-stage' as any)

            expect(quiz).toBeUndefined()
        })
    })

    describe('getAllConcepts', () => {
        it('should return array of concept IDs', () => {
            const concepts = ContentService.getAllConcepts()

            expect(concepts).toBeInstanceOf(Array)
            expect(concepts.length).toBeGreaterThan(0)
            concepts.forEach((concept) => {
                expect(typeof concept).toBe('string')
            })
        })

        it('should return unique concepts', () => {
            const concepts = ContentService.getAllConcepts()
            const uniqueConcepts = new Set(concepts)

            expect(concepts.length).toBe(uniqueConcepts.size)
        })
    })

    describe('searchContent', () => {
        it('should find modules by keyword', () => {
            const results = ContentService.searchContent('protocol')

            expect(results.modules.length).toBeGreaterThan(0)
        })

        it('should find stages by keyword', () => {
            const results = ContentService.searchContent('foundation')

            expect(results.stages.length).toBeGreaterThan(0)
        })

        it('should return empty results for non-matching keyword', () => {
            const results = ContentService.searchContent('nonexistentxyzabc')

            expect(results.modules).toEqual([])
            expect(results.stages).toEqual([])
        })

        it('should be case-insensitive', () => {
            const results1 = ContentService.searchContent('PROTOCOL')
            const results2 = ContentService.searchContent('protocol')

            expect(results1.modules.length).toBe(results2.modules.length)
        })
    })

    describe('getModuleProgress', () => {
        it('should calculate module completion percentage', () => {
            const completedModules = {
                'foundations-1': true,
                'foundations-2': true,
            }

            const progress = ContentService.getModuleProgress('foundations', completedModules)

            expect(progress).toBeGreaterThan(0)
            expect(progress).toBeLessThanOrEqual(1)
        })

        it('should return 0 for no completed modules', () => {
            const progress = ContentService.getModuleProgress('foundations', {})

            expect(progress).toBe(0)
        })
    })
})
