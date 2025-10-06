/**
 * KnowledgeMap - Visual representation of concepts and their relationships
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LearnerService } from '@/services'
import { calculateMastery, getMasteryLevel, type MasteryLevel } from '@/lib/mastery'

interface ConceptNode {
  id: string
  name: string
  category: string
  mastery?: number
  relatedConcepts: string[]
}

interface KnowledgeMapProps {
  concepts: ConceptNode[]
  onConceptClick?: (conceptId: string) => void
  className?: string
}

export function KnowledgeMap({
  concepts,
  onConceptClick,
  className = '',
}: KnowledgeMapProps) {
  // Calculate overall mastery from learner's quiz performance
  const masteryData = useMemo(() => {
    try {
      const learner = LearnerService.getLearner()
      const masteryPercentage = calculateMastery(learner)
      const masteryLevel = getMasteryLevel(masteryPercentage)
      return { percentage: masteryPercentage, level: masteryLevel }
    } catch {
      // Learner not initialized yet
      return { percentage: 0, level: 'Beginner' as MasteryLevel }
    }
  }, [])

  const getMasteryBadgeColor = (level: MasteryLevel): string => {
    const colors: Record<MasteryLevel, string> = {
      Beginner: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
      Intermediate: 'bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100',
      Advanced: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100',
      Master: 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100',
    }
    return colors[level]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      protocol: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      transport: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      implementation:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      patterns: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getMasteryColor = (mastery?: number) => {
    if (!mastery) return 'border-gray-300'
    if (mastery >= 0.8) return 'border-green-500'
    if (mastery >= 0.5) return 'border-yellow-500'
    return 'border-red-500'
  }

  const getMasteryLabel = (mastery?: number) => {
    if (!mastery) return 'Not studied'
    if (mastery >= 0.8) return 'Strong'
    if (mastery >= 0.5) return 'Moderate'
    return 'Weak'
  }

  // Group concepts by category
  const conceptsByCategory = concepts.reduce(
    (acc, concept) => {
      if (!acc[concept.category]) {
        acc[concept.category] = []
      }
      acc[concept.category].push(concept)
      return acc
    },
    {} as Record<string, ConceptNode[]>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Mastery Badge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Overall Mastery</span>
            <Badge className={`${getMasteryBadgeColor(masteryData.level)} px-3 py-1 text-sm font-medium`}>
              {masteryData.percentage}% {masteryData.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  masteryData.level === 'Master'
                    ? 'bg-green-500'
                    : masteryData.level === 'Advanced'
                      ? 'bg-yellow-500'
                      : masteryData.level === 'Intermediate'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                }`}
                style={{ width: `${masteryData.percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-fit">
              {masteryData.percentage}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on your quiz performance across all stages
          </p>
        </CardContent>
      </Card>

      {/* Concept Categories */}
      {Object.entries(conceptsByCategory).map(([category, categoryConcepts]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className={getCategoryColor(category)}>{category}</Badge>
              <span className="text-lg capitalize">{category} Concepts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryConcepts.map((concept) => (
                <button
                  key={concept.id}
                  type="button"
                  className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${getMasteryColor(
                    concept.mastery
                  )}`}
                  onClick={() => onConceptClick?.(concept.id)}
                >
                  <div className="space-y-2">
                    <div className="font-semibold">{concept.name}</div>

                    {concept.mastery !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              concept.mastery >= 0.8
                                ? 'bg-green-500'
                                : concept.mastery >= 0.5
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${concept.mastery * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {getMasteryLabel(concept.mastery)}
                        </span>
                      </div>
                    )}

                    {concept.relatedConcepts.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Connected to {concept.relatedConcepts.length} concept
                        {concept.relatedConcepts.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
