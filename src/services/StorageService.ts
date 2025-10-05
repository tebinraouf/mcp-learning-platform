/**
 * StorageService - Abstraction layer for sessionStorage
 * Handles serialization, deserialization, and error handling
 */

import type { Learner, ProgressRecord, FeedbackEntry } from '@/types'

const STORAGE_KEYS = {
    LEARNER: 'mcp-learner',
    PROGRESS: 'mcp-progress',
    FEEDBACK: 'mcp-feedback',
    SESSION_START: 'mcp-session-start',
} as const

/**
 * Save learner profile
 */
export function saveLearner(learner: Learner): void {
    try {
        sessionStorage.setItem(STORAGE_KEYS.LEARNER, JSON.stringify(learner))
    } catch (error) {
        console.error('Failed to save learner:', error)
        throw new Error('Failed to save learner profile')
    }
}

/**
 * Get learner profile
 */
export function getLearner(): Learner | null {
    try {
        const data = sessionStorage.getItem(STORAGE_KEYS.LEARNER)
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.error('Failed to get learner:', error)
        return null
    }
}

/**
 * Save progress records (array of all progress)
 */
export function saveProgress(progress: ProgressRecord[]): void {
    try {
        sessionStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
    } catch (error) {
        console.error('Failed to save progress:', error)
        throw new Error('Failed to save progress')
    }
}

/**
 * Get all progress records
 */
export function getProgress(): ProgressRecord[] {
    try {
        const data = sessionStorage.getItem(STORAGE_KEYS.PROGRESS)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Failed to get progress:', error)
        return []
    }
}

/**
 * Save feedback entries (array of all feedback)
 */
export function saveFeedback(feedback: FeedbackEntry[]): void {
    try {
        sessionStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback))
    } catch (error) {
        console.error('Failed to save feedback:', error)
        throw new Error('Failed to save feedback')
    }
}

/**
 * Get all feedback entries
 */
export function getFeedback(): FeedbackEntry[] {
    try {
        const data = sessionStorage.getItem(STORAGE_KEYS.FEEDBACK)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Failed to get feedback:', error)
        return []
    }
}

/**
 * Save session start timestamp
 */
export function saveSessionStart(timestamp: string): void {
    try {
        sessionStorage.setItem(STORAGE_KEYS.SESSION_START, timestamp)
    } catch (error) {
        console.error('Failed to save session start:', error)
    }
}

/**
 * Get session start timestamp
 */
export function getSessionStart(): string | null {
    try {
        return sessionStorage.getItem(STORAGE_KEYS.SESSION_START)
    } catch (error) {
        console.error('Failed to get session start:', error)
        return null
    }
}

/**
 * Clear all session data
 */
export function clearAllStorage(): void {
    try {
        Object.values(STORAGE_KEYS).forEach((key) => {
            sessionStorage.removeItem(key)
        })
    } catch (error) {
        console.error('Failed to clear storage:', error)
    }
}

/**
 * Check if learner profile exists
 */
export function hasLearner(): boolean {
    return sessionStorage.getItem(STORAGE_KEYS.LEARNER) !== null
}

/**
 * Get storage size estimate (in bytes)
 */
export function getStorageSize(): number {
    let size = 0
    try {
        Object.values(STORAGE_KEYS).forEach((key) => {
            const item = sessionStorage.getItem(key)
            if (item) {
                size += item.length + key.length
            }
        })
    } catch (error) {
        console.error('Failed to calculate storage size:', error)
    }
    return size
}
