/**
 * Stage Detail Page - View stage modules and quiz
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavigationHeader } from '@/components/NavigationHeader'
import { ModuleCard } from '@/components/ModuleCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LearnerService, ContentService, QuizService, FeedbackService } from '@/services'
import type { Stage, Module as ModuleType, StageId } from '@/types'
import { ArrowLeft, CheckCircle, Lock, PlayCircle } from 'lucide-react'
import { FeedbackDialog } from '@/components/FeedbackDialog'

export const dynamic = 'force-dynamic'

interface StagePageProps {
  params: Promise<{
    stageId: string
  }>
}

export default function StagePage({ params }: StagePageProps) {
  const router = useRouter()
  const [stage, setStage] = useState<Stage | null>(null)
  const [moduleCompletions, setModuleCompletions] = useState<Record<string, boolean>>({})
  const [hasPassedQuiz, setHasPassedQuiz] = useState(false)
  const [quizBestScore, setQuizBestScore] = useState(0)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [stageId, setStageId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setStageId(p.stageId))
  }, [params])

  useEffect(() => {
    if (!stageId) return
    
    const loadedStage = ContentService.getStage(stageId as StageId)
    if (!loadedStage) {
      router.push('/')
      return
    }

    setStage(loadedStage)

    const learner = LearnerService.getLearner()
    setModuleCompletions(learner.moduleCompletions)

    const passed = QuizService.hasPassedQuiz(loadedStage.id)
    setHasPassedQuiz(passed)

    const bestScore = QuizService.getBestScore(loadedStage.id)
    setQuizBestScore(bestScore)
  }, [stageId, router])

  const handleModuleClick = (moduleId: string) => {
    router.push(`/module/${moduleId}`)
  }

  const handleStartQuiz = () => {
    if (!stage) return
    router.push(`/quiz/${stage.id}`)
  }

  const handleSubmitFeedback = async (type: 'thumbs-up' | 'thumbs-down', comment?: string) => {
    if (!stage) return
    FeedbackService.submitFeedback(type, 'stage', stage.id, comment)
  }

  if (!stage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  const completedModules = stage.modules.filter((m) => moduleCompletions[m.id]).length
  const moduleCompletion = stage.modules.length > 0 ? completedModules / stage.modules.length : 0
  const allModulesCompleted = completedModules === stage.modules.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        {/* Stage header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{stage.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{stage.description}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {stage.estimatedMinutes} min
            </Badge>
          </div>

          {/* Learning objectives */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Learning Objectives</h2>
            <ul className="space-y-2">
              {stage.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Module Progress</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {completedModules} / {stage.modules.length} completed
                </span>
              </div>
              <Progress value={moduleCompletion * 100} className="h-2" />
            </div>

            {hasPassedQuiz && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Quiz Passed ({Math.round(quizBestScore * 100)}%)</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button onClick={() => setFeedbackOpen(true)} variant="outline">
              Give Feedback
            </Button>
          </div>
        </div>

        {/* Modules */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Modules</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {stage.modules.map((module: ModuleType) => (
              <ModuleCard
                key={module.id}
                module={module}
                isCompleted={moduleCompletions[module.id] || false}
                onClick={() => handleModuleClick(module.id)}
              />
            ))}
          </div>
        </section>

        {/* Quiz section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Quiz</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Test your knowledge with {stage.quiz.questions.length} questions. 
                Passing score: {Math.round(stage.quiz.passingThreshold * 100)}%
              </p>

              {hasPassedQuiz ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      Best Score: {Math.round(quizBestScore * 100)}%
                    </span>
                  </div>
                  <Button onClick={handleStartQuiz} variant="outline" className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                </div>
              ) : allModulesCompleted ? (
                <Button onClick={handleStartQuiz} size="lg" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Start Quiz
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <Lock className="h-5 w-5" />
                  <span>Complete all modules to unlock the quiz</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Feedback dialog */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        context="stage"
        contextName={stage.name}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  )
}
