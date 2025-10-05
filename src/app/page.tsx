/**
 * Home Page - Dashboard with stage overview
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavigationHeader } from '@/components/NavigationHeader'
import { StageCard } from '@/components/StageCard'
import { Button } from '@/components/ui/button'
import { LearnerService, ContentService, AnalyticsService } from '@/services'
import type { Stage, StageId } from '@/types'
import { ArrowRight } from 'lucide-react'

interface StageAnalytics {
  stageId: StageId
  stageName: string
  status: string
  starts: number
  moduleCompletion: number
  completedModules: number
  totalModules: number
  quizAttempts: number
  quizPasses: number
  quizBestScore: number
  quizAverageScore: number
}

export default function HomePage() {
  const router = useRouter()
  const [stages, setStages] = useState<Stage[]>([])
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState<string | null>(null)
  const [stageAnalytics, setStageAnalytics] = useState<Record<string, StageAnalytics>>({})

  useEffect(() => {
    // Initialize learner session
    LearnerService.initializeLearner()

    // Load stages
    const allStages = ContentService.getAllStages()
    setStages(allStages)

    // Load progress
    const summary = LearnerService.getProgressSummary()
    setProgress(summary.percentComplete)
    setCurrentStage(summary.currentStageId)

    // Load analytics for each stage
    const analytics: Record<string, StageAnalytics> = {}
    allStages.forEach((stage) => {
      analytics[stage.id] = AnalyticsService.getStageAnalytics(stage.id)
    })
    setStageAnalytics(analytics)
  }, [])

  const handleStageClick = (stageId: StageId) => {
    const learner = LearnerService.getLearner()
    const status = learner.stageStatuses[stageId]

    if (status === 'locked') {
      // Don't navigate if locked
      return
    }

    // Start stage if not already started
    if (status !== 'in-progress' && status !== 'completed') {
      LearnerService.startStage(stageId)
    }

    router.push(`/stage/${stageId}`)
  }

  const handleContinueLearning = () => {
    if (currentStage) {
      router.push(`/stage/${currentStage}`)
    } else {
      // Start first stage
      const firstStage = stages[0]
      if (firstStage) {
        LearnerService.startStage(firstStage.id)
        router.push(`/stage/${firstStage.id}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader overallProgress={progress} currentStage={currentStage || undefined} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Master the <span className="text-blue-600 dark:text-blue-400">Model Context Protocol</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
            Learn to build powerful AI integrations with MCP. From protocol basics to production deployment.
          </p>

          {progress > 0 ? (
            <div className="space-y-4">
              <div className="max-w-md mx-auto">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {Math.round(progress)}% Complete
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <Button onClick={handleContinueLearning} size="lg" className="gap-2">
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleContinueLearning} size="lg" className="gap-2">
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Learning path */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Learning Path</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage) => {
              const analytics = stageAnalytics[stage.id]
              const learner = LearnerService.getLearner()
              const status = learner.stageStatuses[stage.id]

              return (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  status={status}
                  moduleCompletion={analytics?.moduleCompletion || 0}
                  quizBestScore={analytics?.quizBestScore}
                  onClick={() => handleStageClick(stage.id)}
                />
              )
            })}
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stages.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Learning Stages</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stages.reduce((sum, s) => sum + s.modules.length, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Modules</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              ~{ContentService.getTotalEstimatedTime()} min
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Learning Time</div>
          </div>
        </section>
      </main>
    </div>
  )
}

