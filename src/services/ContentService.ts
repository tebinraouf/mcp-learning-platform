/**
 * ContentService - Retrieve and filter educational content
 */

import type { Stage, Module, StageId, ModuleId } from '@/types'
import { stages, getStageById } from '@/content/stages'
import * as LearnerService from './LearnerService'

/**
 * Get all stages
 */
export function getAllStages(): Stage[] {
    return stages
}

/**
 * Get stage by ID
 */
export function getStage(stageId: StageId): Stage | undefined {
    return getStageById(stageId)
}

/**
 * Get modules for a stage
 */
export function getStageModules(stageId: StageId): Module[] {
    const stage = getStage(stageId)
    return stage?.modules || []
}

/**
 * Get a specific module by ID
 */
export function getModule(moduleId: ModuleId): Module | undefined {
    for (const stage of stages) {
        const module = stage.modules.find((m) => m.id === moduleId)
        if (module) return module
    }
    return undefined
}

/**
 * Get accessible stages based on learner progress
 */
export function getAccessibleStages(): Stage[] {
    const completedStages = LearnerService.getCompletedStages()

    return stages.filter((stage) => {
        // First stage is always accessible
        if (stage.prerequisites.length === 0) return true

        // Check if all prerequisites are completed
        return stage.prerequisites.every((prereqId) =>
            completedStages.includes(prereqId)
        )
    })
}

/**
 * Get locked stages (prerequisites not met)
 */
export function getLockedStages(): Stage[] {
    const accessible = getAccessibleStages()
    const accessibleIds = new Set(accessible.map((s) => s.id))

    return stages.filter((stage) => !accessibleIds.has(stage.id))
}

/**
 * Get next stage to unlock based on current progress
 */
export function getNextStage(): Stage | null {
    const learner = LearnerService.getLearner()
    const completedStages = LearnerService.getCompletedStages()

    // Find first stage that is not completed but has all prerequisites met
    for (const stage of stages) {
        if (learner.stageStatuses[stage.id] === 'completed') continue

        const prerequisitesMet = stage.prerequisites.every((prereqId) =>
            completedStages.includes(prereqId)
        )

        if (prerequisitesMet) {
            return stage
        }
    }

    return null // All stages completed
}

/**
 * Get total estimated time for all stages
 */
export function getTotalEstimatedTime(): number {
    return stages.reduce((total, stage) => total + stage.estimatedMinutes, 0)
}

/**
 * Get remaining estimated time based on completed stages
 */
export function getRemainingEstimatedTime(): number {
    const completedStages = LearnerService.getCompletedStages()

    return stages
        .filter((stage) => !completedStages.includes(stage.id))
        .reduce((total, stage) => total + stage.estimatedMinutes, 0)
}

/**
 * Search content by keyword
 */
export function searchContent(query: string): {
    stages: Stage[]
    modules: Array<{ module: Module; stageId: StageId }>
} {
    const lowerQuery = query.toLowerCase()
    const matchingStages: Stage[] = []
    const matchingModules: Array<{ module: Module; stageId: StageId }> = []

    stages.forEach((stage) => {
        const stageMatches =
            stage.name.toLowerCase().includes(lowerQuery) ||
            stage.description.toLowerCase().includes(lowerQuery) ||
            stage.objectives.some((obj) => obj.toLowerCase().includes(lowerQuery))

        if (stageMatches) {
            matchingStages.push(stage)
        }

        stage.modules.forEach((module) => {
            const moduleMatches =
                module.title.toLowerCase().includes(lowerQuery) ||
                module.objectives.some((obj) => obj.toLowerCase().includes(lowerQuery))

            if (moduleMatches) {
                matchingModules.push({ module, stageId: stage.id })
            }
        })
    })

    return { stages: matchingStages, modules: matchingModules }
}

/**
 * Get all concepts from all stages
 */
export function getAllConcepts(): string[] {
    const concepts = new Set<string>()

    stages.forEach((stage) => {
        stage.concepts.forEach((concept) => concepts.add(concept))
    })

    return Array.from(concepts).sort()
}

/**
 * Get modules related to a concept
 */
export function getModulesForConcept(
    conceptId: string
): Array<{ module: Module; stageId: StageId }> {
    const matches: Array<{ module: Module; stageId: StageId }> = []

    stages.forEach((stage) => {
        stage.modules.forEach((module) => {
            if (module.relatedConcepts.includes(conceptId)) {
                matches.push({ module, stageId: stage.id })
            }
        })
    })

    return matches
}
