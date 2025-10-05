/**
 * ModuleCard - Display module information
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Module } from '@/types'
import { BookOpen, CheckCircle2 } from 'lucide-react'

interface ModuleCardProps {
  module: Module
  isCompleted?: boolean
  onClick?: () => void
  className?: string
}

export function ModuleCard({
  module,
  isCompleted = false,
  onClick,
  className = '',
}: ModuleCardProps) {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <BookOpen className="h-4 w-4 text-blue-600" />
              )}
              <CardTitle className="text-lg">{module.title}</CardTitle>
            </div>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Objectives */}
        <div>
          <h4 className="text-sm font-semibold mb-2">What you'll learn</h4>
          <ul className="text-sm space-y-1">
            {module.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span className="flex-1">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Concepts */}
        {module.relatedConcepts.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {module.relatedConcepts.slice(0, 4).map((concept) => (
              <Badge key={concept} variant="outline" className="text-xs">
                {concept}
              </Badge>
            ))}
            {module.relatedConcepts.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{module.relatedConcepts.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t">
          <span>⏱️ {module.estimatedMinutes} min</span>
          <span>•</span>
          <span>📄 {module.content.sections.length} sections</span>
          {module.content.examples && module.content.examples.length > 0 && (
            <>
              <span>•</span>
              <span>💻 {module.content.examples.length} examples</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
