/**
 * Format duration in milliseconds to human-readable string
 * 
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 * - <1 minute: "Xs"
 * - 1-60 minutes: "Xm Ys"
 * - >60 minutes: "Xh Ym"
 */
export function formatDuration(ms: number): string {
    if (ms <= 0) return '0s'

    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
        const remainingMinutes = minutes % 60
        return `${hours}h ${remainingMinutes}m`
    }

    if (minutes > 0) {
        const remainingSeconds = seconds % 60
        return `${minutes}m ${remainingSeconds}s`
    }

    return `${seconds}s`
}
