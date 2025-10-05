/**
 * QuizQuestion - Interactive quiz question component
 * Displays a question with multiple choice options
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Question, QuestionOption } from '@/types'

interface QuizQuestionProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedOptionId?: string
  onSelectOption: (optionId: string) => void
  showResult?: boolean
  onNext?: () => void
  isLastQuestion?: boolean
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  showResult = false,
  onNext,
  isLastQuestion = false,
}: QuizQuestionProps) {
  const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null)

  const getOptionClassName = (option: QuestionOption) => {
    const baseClass =
      'w-full text-left p-4 rounded-lg border-2 transition-all duration-200'

    if (!showResult) {
      // Before answer submission
      if (selectedOptionId === option.id) {
        return `${baseClass} border-blue-500 bg-blue-50 dark:bg-blue-950`
      }
      if (hoveredOptionId === option.id) {
        return `${baseClass} border-gray-300 bg-gray-50 dark:bg-gray-900 hover:border-gray-400`
      }
      return `${baseClass} border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900`
    }

    // After answer submission
    if (option.isCorrect) {
      return `${baseClass} border-green-500 bg-green-50 dark:bg-green-950`
    }
    if (selectedOptionId === option.id && !option.isCorrect) {
      return `${baseClass} border-red-500 bg-red-50 dark:bg-red-950`
    }
    return `${baseClass} border-gray-200 opacity-60`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl" id={`question-${questionNumber}`}>
          {question.prompt}
        </CardTitle>
        {question.conceptTag && (
          <div className="mt-2">
            <Badge variant="secondary">{question.conceptTag}</Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Options */}
        <div 
          className="space-y-2"
          role="radiogroup"
          aria-labelledby={`question-${questionNumber}`}
          aria-required="true"
        >
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selectedOptionId === option.id}
              aria-label={`${option.text}${showResult && option.isCorrect ? ' (Correct answer)' : ''}${showResult && selectedOptionId === option.id && !option.isCorrect ? ' (Incorrect)' : ''}`}
              className={getOptionClassName(option)}
              onClick={() => !showResult && onSelectOption(option.id)}
              disabled={showResult}
              onMouseEnter={() => !showResult && setHoveredOptionId(option.id)}
              onMouseLeave={() => setHoveredOptionId(null)}
            >
              <div className="flex items-start gap-3">
                {/* Radio indicator */}
                <div className="mt-1">
                  {showResult ? (
                    option.isCorrect ? (
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    ) : selectedOptionId === option.id ? (
                      <span className="text-red-600 dark:text-red-400">✗</span>
                    ) : (
                      <span className="text-gray-400">○</span>
                    )
                  ) : selectedOptionId === option.id ? (
                    <span className="text-blue-600 dark:text-blue-400">●</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                </div>

                {/* Option text */}
                <span className="flex-1">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Rationale (shown after submission) */}
        {showResult && (
          <section 
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
            aria-label="Answer explanation"
          >
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Explanation
            </h4>
            <p className="text-blue-800 dark:text-blue-200">{question.rationale}</p>
          </section>
        )}

        {/* Next button */}
        {showResult && onNext && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={onNext} 
              size="lg"
              aria-label={isLastQuestion ? 'Finish quiz and view results' : 'Continue to next question'}
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
