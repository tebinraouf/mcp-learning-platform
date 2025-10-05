/**
 * StageCard - Display stage information with progress
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Stage, StageStatus } from '@/types'
import { Lock, CheckCircle, PlayCircle } from 'lucide-react'

interface StageCardProps {
  stage: Stage
  status: StageStatus
  moduleCompletion?: number
  quizBestScore?: number
  onClick?: () => void
  className?: string
}

export function StageCard({
  stage,
  status,
  moduleCompletion = 0,
  quizBestScore,
  onClick,
  className = '',
}: StageCardProps) {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isInProgress = status === 'in-progress'

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (isInProgress) return <PlayCircle className="h-5 w-5 text-blue-600" />
    return <Lock className="h-5 w-5 text-gray-400" />
  }

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
    }
    if (isInProgress) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>
    }
    return <Badge variant="secondary">Locked</Badge>
  }

  return (
    <Card
      className={`transition-all duration-200 ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
      } ${className}`}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <CardTitle className="text-xl">{stage.name}</CardTitle>
            </div>
            <CardDescription>{stage.description}</CardDescription>
          </div>
          <div>{getStatusBadge()}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Objectives */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Learning Objectives</h4>
          <ul className="text-sm space-y-1">
            {stage.objectives.slice(0, 3).map((objective) => (
              <li key={objective} className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span className="flex-1">{objective}</span>
              </li>
            ))}
            {stage.objectives.length > 3 && (
              <li className="text-gray-500 text-xs">
                +{stage.objectives.length - 3} more objectives
              </li>
            )}
          </ul>
        </div>

        {/* Progress indicators (only for in-progress or completed) */}
        {!isLocked && (
          <div className="space-y-3">
            {/* Module completion */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Modules</span>
                <span className="font-medium">{Math.round(moduleCompletion * 100)}%</span>
              </div>
              <Progress value={moduleCompletion * 100} className="h-2" />
            </div>

            {/* Quiz score */}
            {quizBestScore !== undefined && quizBestScore > 0 && (
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Best Quiz Score</span>
                  <span className="font-medium">{Math.round(quizBestScore * 100)}%</span>
                </div>
                <Progress value={quizBestScore * 100} className="h-2" />
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t">
          <span>⏱️ {stage.estimatedMinutes} min</span>
          <span>📚 {stage.modules.length} modules</span>
          <span>❓ {stage.quiz.questions.length} quiz questions</span>
        </div>

        {/* Prerequisites (only show if locked) */}
        {isLocked && stage.prerequisites.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Complete {stage.prerequisites.length} prerequisite stage{stage.prerequisites.length > 1 ? 's' : ''} to unlock
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
