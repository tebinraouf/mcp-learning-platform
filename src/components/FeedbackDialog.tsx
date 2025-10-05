/**
 * FeedbackDialog - Collect user feedback with thumbs up/down
 */

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { SESSION_LIMITS } from '@/types'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  context: 'stage' | 'module' | 'quiz'
  contextName: string
  onSubmit: (
    type: 'thumbs-up' | 'thumbs-down',
    comment?: string
  ) => void | Promise<void>
}

export function FeedbackDialog({
  open,
  onOpenChange,
  context,
  contextName,
  onSubmit,
}: FeedbackDialogProps) {
  const [selectedType, setSelectedType] = useState<'thumbs-up' | 'thumbs-down' | null>(
    null
  )
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedType) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedType, comment.trim() || undefined)
      // Reset state
      setSelectedType(null)
      setComment('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getContextLabel = () => {
    switch (context) {
      case 'stage':
        return 'stage'
      case 'module':
        return 'module'
      case 'quiz':
        return 'quiz'
      default:
        return 'content'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was this {getContextLabel()}?</DialogTitle>
          <DialogDescription>
            We'd love to hear your feedback on <strong>{contextName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Thumbs up/down buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedType === 'thumbs-up'
                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950'
              }`}
              onClick={() => setSelectedType('thumbs-up')}
            >
              <ThumbsUp
                className={`h-8 w-8 ${
                  selectedType === 'thumbs-up'
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              />
              <span className="text-sm font-medium">Good</span>
            </button>

            <button
              type="button"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedType === 'thumbs-down'
                  ? 'border-red-500 bg-red-50 dark:bg-red-950'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950'
              }`}
              onClick={() => setSelectedType('thumbs-down')}
            >
              <ThumbsDown
                className={`h-8 w-8 ${
                  selectedType === 'thumbs-down' ? 'text-red-600' : 'text-gray-400'
                }`}
              />
              <span className="text-sm font-medium">Not Good</span>
            </button>
          </div>

          {/* Optional comment */}
          {selectedType && (
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Additional comments (optional)
              </label>
              <textarea
                id="comment"
                className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  selectedType === 'thumbs-up'
                    ? 'What did you like?'
                    : 'What could be improved?'
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={SESSION_LIMITS.MAX_COMMENT_LENGTH}
              />
              <p className="text-xs text-gray-500 text-right">
                {comment.length}/{SESSION_LIMITS.MAX_COMMENT_LENGTH}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
