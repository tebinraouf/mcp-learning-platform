'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LearnerService, ContentService, QuizService, AnalyticsService } from '@/services'
import type { Learner, Stage } from '@/types'
import { ArrowLeft, TrendingUp, Award, Clock, Target, BookOpen, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { NavigationHeader } from '@/components/NavigationHeader'

export default function ProgressPage() {
  const router = useRouter()
  const [learner, setLearner] = useState<Learner | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [sessionAnalytics, setSessionAnalytics] = useState<ReturnType<typeof AnalyticsService.getSessionAnalytics> | null>(null)
  const [quizPerformance, setQuizPerformance] = useState<ReturnType<typeof AnalyticsService.getQuizPerformanceSummary> | null>(null)
  const [engagement, setEngagement] = useState<ReturnType<typeof AnalyticsService.getEngagementMetrics> | null>(null)
  const [milestones, setMilestones] = useState<ReturnType<typeof AnalyticsService.getProgressMilestones>>([])

  useEffect(() => {
    try {
      const currentLearner = LearnerService.getLearner()
      const allStages = ContentService.getAllStages()
      const analytics = AnalyticsService.getSessionAnalytics()
      const quizPerf = AnalyticsService.getQuizPerformanceSummary()
      const engagementMetrics = AnalyticsService.getEngagementMetrics()
      const progressMilestones = AnalyticsService.getProgressMilestones()

      setLearner(currentLearner)
      setStages(allStages)
      setSessionAnalytics(analytics)
      setQuizPerformance(quizPerf)
      setEngagement(engagementMetrics)
      setMilestones(progressMilestones)
    } catch (error) {
      console.error('Error loading progress data:', error)
    }
  }, [])

  if (!learner || !sessionAnalytics || !quizPerformance || !engagement) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    )
  }

  // Calculate overall progress
  const completedStages = Object.values(learner.stageStatuses).filter(s => s === 'completed').length
  const totalStages = stages.length
  const overallProgress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0

  // Calculate module completion
  const totalModules = stages.reduce((sum, stage) => sum + stage.modules.length, 0)
  const completedModules = Object.keys(learner.moduleCompletions).filter(
    moduleId => learner.moduleCompletions[moduleId]
  ).length
  const moduleProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0

  // Get quiz statistics
  const totalQuizAttempts = learner.quizAttempts.length
  const passedQuizzes = Object.values(learner.sessionCounters.quizPasses).reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-4xl font-bold mb-2">Your Learning Progress</h1>
          <p className="text-muted-foreground">
            Track your journey through the MCP learning path
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stages Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedStages} / {totalStages}</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(overallProgress)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedModules} / {totalModules}</div>
              <Progress value={moduleProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(moduleProgress)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Passed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passedQuizzes} / {totalStages}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalQuizAttempts} total attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {LearnerService.getSessionDurationMinutes()}m
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {learner.sessionCounters.interactionCount} interactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Metrics
              </CardTitle>
              <CardDescription>Your learning pace and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Session Duration</span>
                <span className="text-lg font-semibold">
                  {sessionAnalytics.duration} min
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Learning Velocity</span>
                <span className="text-lg font-semibold">
                  {AnalyticsService.getLearningVelocity().toFixed(2)} stages/hr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Module Completion Rate</span>
                <span className="text-lg font-semibold">
                  {Math.round(engagement.moduleCompletionRate * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Quiz Performance
              </CardTitle>
              <CardDescription>Your quiz results and accuracy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pass Rate</span>
                <span className="text-lg font-semibold">
                  {Math.round(quizPerformance.passRate * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="text-lg font-semibold">
                  {Math.round(quizPerformance.averageScore * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Attempts</span>
                <span className="text-lg font-semibold">
                  {quizPerformance.totalAttempts}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stage Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stage-by-Stage Progress</CardTitle>
            <CardDescription>Detailed breakdown of your progress through each learning stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stages.map((stage) => {
                const stageStatus = learner.stageStatuses[stage.id]
                const stageModules = stage.modules
                const completedStageModules = stageModules.filter(
                  m => learner.moduleCompletions[m.id]
                ).length
                const stageProgress = stageModules.length > 0 
                  ? (completedStageModules / stageModules.length) * 100 
                  : 0

                const quizStats = QuizService.getQuizStats(stage.id)
                const hasQuiz = stage.quiz !== undefined

                return (
                  <div key={stage.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{stage.name}</h3>
                          <Badge variant={
                            stageStatus === 'completed' ? 'default' : 
                            stageStatus === 'in-progress' ? 'secondary' : 
                            'outline'
                          }>
                            {stageStatus === 'completed' ? 'Completed' :
                             stageStatus === 'in-progress' ? 'In Progress' :
                             'Locked'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {stage.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/stage/${stage.id}`)}
                        disabled={stageStatus === 'locked'}
                      >
                        View Stage
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Modules</span>
                          <span className="font-medium">{completedStageModules} / {stageModules.length}</span>
                        </div>
                        <Progress value={stageProgress} />
                      </div>

                      {hasQuiz && (
                        <>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Quiz Attempts</span>
                              <span className="font-medium">{quizStats.totalAttempts}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {quizStats.passed ? `Passed on attempt ${quizStats.passedOnAttempt}` : 'Not passed yet'}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Best Score</span>
                              <span className="font-medium">{Math.round(quizStats.bestScore * 100)}%</span>
                            </div>
                            <Progress value={quizStats.bestScore * 100} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Milestones you&apos;ve reached</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {milestones.map((milestone) => (
                  <div key={milestone.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-primary/20">
                    <Award className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="font-medium text-sm">{milestone.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
