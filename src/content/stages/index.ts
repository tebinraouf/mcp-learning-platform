/**
 * Educational content stages for MCP Learning Platform
 * Export all stages as a single array
 */

import type { Stage } from '@/types'
import { foundationsStage } from './foundations'
import { architectureMessagesStage } from './architecture-messages'
import { advancedPatternsStage } from './advanced-patterns'
import { buildingDebuggingStage } from './building-debugging'
import { masteryStage } from './mastery'

/**
 * All learning stages in sequence order
 */
export const stages: Stage[] = [
    foundationsStage,
    architectureMessagesStage,
    advancedPatternsStage,
    buildingDebuggingStage,
    masteryStage,
]

/**
 * Get stage by ID
 */
export function getStageById(id: string): Stage | undefined {
    return stages.find((stage) => stage.id === id)
}

/**
 * Get all stages
 */
export function getAllStages(): Stage[] {
    return stages
}

/**
 * Get stages a learner can access based on completed stages
 */
export function getAccessibleStages(completedStageIds: string[]): Stage[] {
    return stages.filter((stage) => {
        // First stage is always accessible
        if (stage.prerequisites.length === 0) return true

        // Check if all prerequisites are completed
        return stage.prerequisites.every((prereqId) =>
            completedStageIds.includes(prereqId)
        )
    })
}
