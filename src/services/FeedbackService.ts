/**
 * FeedbackService - Collect and manage user feedback
 */

import type { FeedbackEntry } from '@/types'
import * as StorageService from './StorageService'
import { v4 as uuidv4 } from 'uuid'
import { SESSION_LIMITS } from '@/types'

/**
 * Submit feedback
 */
export function submitFeedback(
    type: 'thumbs-up' | 'thumbs-down',
    context: 'stage' | 'module' | 'quiz',
    contextId: string,
    comment?: string
): FeedbackEntry {
    const entries = StorageService.getFeedback()

    // Enforce max feedback entries limit
    if (entries.length >= SESSION_LIMITS.MAX_FEEDBACK_ENTRIES) {
        throw new Error(
            `Maximum feedback limit reached (${SESSION_LIMITS.MAX_FEEDBACK_ENTRIES})`
        )
    }

    // Validate comment length
    if (comment && comment.length > SESSION_LIMITS.MAX_COMMENT_LENGTH) {
        throw new Error(
            `Comment too long (max ${SESSION_LIMITS.MAX_COMMENT_LENGTH} characters)`
        )
    }

    const feedback: FeedbackEntry = {
        id: uuidv4(),
        timestamp: new Date(),
        type,
        context,
        contextId,
        comment: comment?.trim(),
    }

    const updatedEntries = [...entries, feedback]
    StorageService.saveFeedback(updatedEntries)

    return feedback
}

/**
 * Get all feedback entries
 */
export function getAllFeedback(): FeedbackEntry[] {
    return StorageService.getFeedback()
}

/**
 * Get feedback for a specific context
 */
export function getFeedbackForContext(
    context: 'stage' | 'module' | 'quiz',
    contextId: string
): FeedbackEntry[] {
    const entries = StorageService.getFeedback()
    return entries.filter(
        (entry) => entry.context === context && entry.contextId === contextId
    )
}

/**
 * Get feedback statistics
 */
export function getFeedbackStats() {
    const entries = StorageService.getFeedback()

    const thumbsUp = entries.filter((e) => e.type === 'thumbs-up').length
    const thumbsDown = entries.filter((e) => e.type === 'thumbs-down').length
    const withComments = entries.filter((e) => e.comment).length

    return {
        total: entries.length,
        thumbsUp,
        thumbsDown,
        withComments,
        sentiment: thumbsUp + thumbsDown > 0 ? thumbsUp / (thumbsUp + thumbsDown) : 0,
    }
}

/**
 * Get sentiment by context type
 */
export function getSentimentByContext() {
    const entries = StorageService.getFeedback()

    const byContext: Record<
        string,
        { thumbsUp: number; thumbsDown: number; sentiment: number }
    > = {
        stage: { thumbsUp: 0, thumbsDown: 0, sentiment: 0 },
        module: { thumbsUp: 0, thumbsDown: 0, sentiment: 0 },
        quiz: { thumbsUp: 0, thumbsDown: 0, sentiment: 0 },
    }

    entries.forEach((entry) => {
        if (entry.type === 'thumbs-up') {
            byContext[entry.context].thumbsUp++
        } else {
            byContext[entry.context].thumbsDown++
        }
    })

    // Calculate sentiments
    Object.keys(byContext).forEach((context) => {
        const stats = byContext[context]
        const total = stats.thumbsUp + stats.thumbsDown
        stats.sentiment = total > 0 ? stats.thumbsUp / total : 0
    })

    return byContext
}

/**
 * Clear all feedback (for testing)
 */
export function clearFeedback(): void {
    StorageService.saveFeedback([])
}

/**
 * Check if feedback limit reached
 */
export function isFeedbackLimitReached(): boolean {
    const entries = StorageService.getFeedback()
    return entries.length >= SESSION_LIMITS.MAX_FEEDBACK_ENTRIES
}

/**
 * Get recent feedback (last N entries)
 */
export function getRecentFeedback(count: number = 5): FeedbackEntry[] {
    const entries = StorageService.getFeedback()
    return entries
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, count)
}
