/**
 * Accessibility Utilities
 * 
 * Helper functions and constants for ensuring WCAG AA compliance
 * and improving accessibility throughout the application.
 */

/**
 * ARIA Live Region Announcer
 * 
 * Announces dynamic content changes to screen readers.
 * Useful for quiz feedback, progress updates, etc.
 */
export function announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
) {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only' // Visually hidden but accessible
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement)
    }, 1000)
}

/**
 * Focus Management
 * 
 * Moves focus to a specific element, useful for skip links,
 * modal dialogs, and page navigation.
 */
export function moveFocusTo(elementId: string) {
    const element = document.getElementById(elementId)
    if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

/**
 * Keyboard Navigation Helpers
 */
export const KeyCodes = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    TAB: 'Tab',
    HOME: 'Home',
    END: 'End',
} as const

/**
 * Check if an event is an activation key (Enter or Space)
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
    return event.key === KeyCodes.ENTER || event.key === KeyCodes.SPACE
}

/**
 * Trap focus within a container (useful for modals/dialogs)
 */
export function trapFocus(containerElement: HTMLElement) {
    const focusableElements = containerElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== KeyCodes.TAB) return

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
        }
    }

    containerElement.addEventListener('keydown', handleTabKey)

    // Return cleanup function
    return () => {
        containerElement.removeEventListener('keydown', handleTabKey)
    }
}

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0
export function generateUniqueId(prefix: string = 'id'): string {
    idCounter += 1
    return `${prefix}-${idCounter}-${Date.now()}`
}

/**
 * ARIA Label Helpers
 */
export function getAriaLabel(
    label: string,
    context?: string
): string {
    return context ? `${label}, ${context}` : label
}

/**
 * Skip Link Component Helper
 * 
 * Creates accessible skip navigation links
 */
export function createSkipLink(targetId: string, label: string) {
    return {
        href: `#${targetId}`,
        label,
        onClick: (e: React.MouseEvent) => {
            e.preventDefault()
            moveFocusTo(targetId)
        },
    }
}

/**
 * Color Contrast Utilities
 * 
 * Ensures sufficient color contrast for WCAG AA (4.5:1 for normal text, 3:1 for large text)
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        const sRGB = c / 255
        return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number | null {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    if (!rgb1 || !rgb2) return null

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)

    return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background)
    if (!ratio) return false

    return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Accessible Form Validation
 */
export function getAriaInvalid(hasError: boolean): 'true' | 'false' {
    return hasError ? 'true' : 'false'
}

export function getAriaDescribedBy(
    errorId?: string,
    helpTextId?: string
): string | undefined {
    const ids = [errorId, helpTextId].filter(Boolean)
    return ids.length > 0 ? ids.join(' ') : undefined
}
