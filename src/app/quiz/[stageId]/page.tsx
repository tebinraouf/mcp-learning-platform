'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ContentService, QuizService, FeedbackService } from '@/services'
import type { Stage, Quiz, QuizAttempt, QuizAnswer, StageId } from '@/types'
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QuizQuestion } from '@/components/QuizQuestion'
import { FeedbackDialog } from '@/components/FeedbackDialog'
import { NavigationHeader } from '@/components/NavigationHeader'
import { Progress } from '@/components/ui/progress'

export const dynamic = 'force-dynamic'

interface QuizPageProps {
  params: Promise<{
    stageId: string
  }>
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter()
  const [stage, setStage] = useState<Stage | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answersInProgress, setAnswersInProgress] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [stageId, setStageId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setStageId(p.stageId))
  }, [params])

  useEffect(() => {
    if (!stageId) return
    
    const loadedStage = ContentService.getStage(stageId as StageId)
    
    if (loadedStage?.quiz) {
      setStage(loadedStage)
      setQuiz(loadedStage.quiz)
      
      // Check if there's an existing completed attempt to review
      const latestAttempt = QuizService.getLatestAttempt(stageId as StageId)
      
      if (latestAttempt?.completedAt) {
        // Review mode - show completed attempt
        setCurrentAttempt(latestAttempt)
        setAnswersInProgress(latestAttempt.answers)
        setShowResults(true)
      } else {
        // Start new attempt
        const newAttempt = QuizService.startQuizAttempt(loadedStage.quiz)
        setCurrentAttempt(newAttempt)
        setAnswersInProgress([])
        setShowResults(false)
      }
    }
  }, [stageId])

  const handleAnswerSelect = (questionId: string, optionId: string, isCorrect: boolean) => {
    if (showResults || !quiz) return // Don't allow changes after submission
    
    // Remove any existing answer for this question
    const filteredAnswers = answersInProgress.filter(a => a.questionId !== questionId)
    
    // Add new answer
    const newAnswer: QuizAnswer = {
      questionId,
      selectedOptionId: optionId,
      isCorrect,
    }
    
    setAnswersInProgress([...filteredAnswers, newAnswer])
  }

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    if (!currentAttempt || !quiz) return

    // Create completed attempt with all answers
    const attemptWithAnswers: QuizAttempt = {
      ...currentAttempt,
      answers: answersInProgress
    }

    const result = QuizService.completeQuizAttempt(attemptWithAnswers, quiz)

    setCurrentAttempt(result)
    setAnswersInProgress(result.answers)
    setShowResults(true)
    setCurrentQuestionIndex(0) // Reset to first question for review
  }

  const handleRetakeQuiz = () => {
    if (!quiz) return

    const newAttempt = QuizService.startQuizAttempt(quiz)
    setCurrentAttempt(newAttempt)
    setAnswersInProgress([])
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  const handleFeedbackSubmit = (type: 'thumbs-up' | 'thumbs-down', comment?: string) => {
    if (stage) {
      FeedbackService.submitFeedback(type, 'quiz', stage.id, comment)
      setFeedbackOpen(false)
    }
  }

  const handleContinue = () => {
    if (!stage) return

    // Navigate to next stage if this quiz passed
    const nextStageOrder = stage.sequenceOrder + 1
    const allStages = ContentService.getAllStages()
    const nextStage = allStages.find(s => s.sequenceOrder === nextStageOrder)

    if (nextStage) {
      router.push(`/stage/${nextStage.id}`)
    } else {
      // No more stages, go home
      router.push('/')
    }
  }

  if (!stage || !quiz || !currentAttempt) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const answeredCount = answersInProgress.length
  const allAnswered = answeredCount === totalQuestions
  const progressPercent = (currentQuestionIndex + 1) / totalQuestions * 100

  const isPassed = currentAttempt.score !== undefined && currentAttempt.score >= quiz.passingThreshold
  const isFailed = currentAttempt.score !== undefined && currentAttempt.score < quiz.passingThreshold

  // Get answer for current question
  const currentAnswer = answersInProgress.find(a => a.questionId === currentQuestion.id)

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/stage/${stage.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {stage.name}
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{stage.name} Quiz</h1>
              <p className="text-muted-foreground">
                {showResults 
                  ? 'Review your answers and results'
                  : `Answer all ${totalQuestions} questions to complete this stage`
                }
              </p>
            </div>

            {showResults && (
              <Badge 
                variant={isPassed ? 'default' : 'destructive'}
                className="ml-4"
              >
                {isPassed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Passed
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Failed
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        {!showResults && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <span>{answeredCount} answered</span>
                </div>
                <Progress value={progressPercent} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {showResults && currentAttempt.score !== undefined && (
          <Card className={`mb-6 ${isPassed ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPassed ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Congratulations! You Passed
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    Keep Learning
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Your score: {Math.round(currentAttempt.score * 100)}% (Passing: {Math.round(quiz.passingThreshold * 100)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Correct answers: </span>
                  <span>{Math.round(currentAttempt.score * totalQuestions)} / {totalQuestions}</span>
                </div>

                {isPassed && (
                  <p className="text-sm text-muted-foreground">
                    Great job! You&apos;ve completed this stage. Review your answers below or continue to the next stage.
                  </p>
                )}

                {isFailed && quiz && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Recommended Review</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Focus on these concepts for your next attempt:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QuizService.getWeakConcepts(stage.id, quiz).map((concept) => (
                        <Badge key={concept} variant="outline">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Display */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <Badge variant="outline">
                {currentQuestion.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <QuizQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              selectedOptionId={currentAnswer?.selectedOptionId}
              onSelectOption={(optionId) => {
                const isCorrect = currentQuestion.correctAnswerId === optionId
                handleAnswerSelect(currentQuestion.id, optionId, isCorrect)
              }}
              showResult={showResults}
            />
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex flex-col gap-4">
          {/* Question Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {quiz.questions.map((question, index) => {
                const hasAnswer = answersInProgress.some(a => a.questionId === question.id)
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-primary text-primary-foreground'
                        : hasAnswer
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
            >
              Next
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!showResults && (
              <Button
                size="lg"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="flex-1"
              >
                {allAnswered ? 'Submit Quiz' : `Answer ${totalQuestions - answeredCount} more question${totalQuestions - answeredCount !== 1 ? 's' : ''}`}
              </Button>
            )}

            {showResults && (
              <>
                {isPassed && (
                  <Button
                    size="lg"
                    onClick={handleContinue}
                    className="flex-1"
                  >
                    Continue to Next Stage
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleRetakeQuiz}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setFeedbackOpen(true)}
                >
                  Share Feedback
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quiz Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions:</span>
              <span className="font-medium">{totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passing Score:</span>
              <span className="font-medium">{Math.round(quiz.passingThreshold * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Attempts:</span>
              <span className="font-medium">
                {QuizService.getQuizStats(stage.id).totalAttempts}
              </span>
            </div>
            {currentAttempt.score !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Best Score:</span>
                <span className="font-medium">
                  {Math.round(QuizService.getQuizStats(stage.id).bestScore * 100)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onSubmit={handleFeedbackSubmit}
        context="quiz"
        contextName={`${stage.name} Quiz`}
      />
    </div>
  )
}
