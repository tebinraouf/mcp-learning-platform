import { formatDuration } from '../time'

describe('formatDuration', () => {
    it('formats duration < 1 minute as seconds', () => {
        expect(formatDuration(5000)).toBe('5s')
        expect(formatDuration(45000)).toBe('45s')
        expect(formatDuration(59000)).toBe('59s')
    })

    it('formats duration 1-60 minutes as minutes and seconds', () => {
        expect(formatDuration(90000)).toBe('1m 30s')
        expect(formatDuration(180000)).toBe('3m 0s')
        expect(formatDuration(125000)).toBe('2m 5s')
        expect(formatDuration(3540000)).toBe('59m 0s')
    })

    it('formats duration > 60 minutes as hours and minutes (no seconds)', () => {
        expect(formatDuration(3600000)).toBe('1h 0m')
        expect(formatDuration(5400000)).toBe('1h 30m')
        expect(formatDuration(7200000)).toBe('2h 0m')
        expect(formatDuration(9000000)).toBe('2h 30m')
    })

    it('handles 0 milliseconds', () => {
        expect(formatDuration(0)).toBe('0s')
    })

    it('handles negative values gracefully', () => {
        expect(formatDuration(-1000)).toBe('0s')
        expect(formatDuration(-60000)).toBe('0s')
    })

    it('handles exactly 1 minute', () => {
        expect(formatDuration(60000)).toBe('1m 0s')
    })

    it('handles exactly 1 hour', () => {
        expect(formatDuration(3600000)).toBe('1h 0m')
    })
})
