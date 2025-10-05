/**
 * ProgressBar - Visual progress indicator with percentage
 */

'use client'

import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  className = '',
}: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <Progress value={percentage} className="h-2" />
      {total > 0 && (
        <p className="text-xs text-gray-500">
          {current} of {total} completed
        </p>
      )}
    </div>
  )
}
