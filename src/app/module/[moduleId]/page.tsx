'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LearnerService, ContentService, FeedbackService } from '@/services'
import type { Module as ModuleType, Stage, ModuleId, ContentSection } from '@/types'
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FeedbackDialog } from '@/components/FeedbackDialog'
import { NavigationHeader } from '@/components/NavigationHeader'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { CodeExample } from '@/components/CodeExample'

export const dynamic = 'force-dynamic'

interface ModulePageProps {
  params: Promise<{
    moduleId: string
  }>
}

export default function ModulePage({ params }: ModulePageProps) {
  const router = useRouter()
  const [module, setModule] = useState<ModuleType | null>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [nextModule, setNextModule] = useState<ModuleType | null>(null)
  const [prevModule, setPrevModule] = useState<ModuleType | null>(null)
  const [moduleId, setModuleId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setModuleId(p.moduleId))
  }, [params])

  useEffect(() => {
    if (!moduleId) return
    
    const loadedModule = ContentService.getModule(moduleId as ModuleId)
    
    if (loadedModule) {
      setModule(loadedModule)
      
      // Load parent stage
      const parentStage = ContentService.getStage(loadedModule.stageId)
      if (parentStage) {
        setStage(parentStage)
      }
      
      // Check completion status
      const learner = LearnerService.getLearner()
      const completed = !!learner.moduleCompletions[loadedModule.id]
      setIsCompleted(completed)
      
      // Find adjacent modules in the stage
      if (parentStage) {
        const currentIndex = parentStage.modules.findIndex(m => m.id === loadedModule.id)
        
        if (currentIndex > 0) {
          const prevMod = ContentService.getModule(parentStage.modules[currentIndex - 1].id)
          if (prevMod) {
            setPrevModule(prevMod)
          }
        }
        
        if (currentIndex < parentStage.modules.length - 1) {
          const nextMod = ContentService.getModule(parentStage.modules[currentIndex + 1].id)
          if (nextMod) {
            setNextModule(nextMod)
          }
        }
      }
    }
  }, [moduleId])

  const handleMarkComplete = () => {
    if (module) {
      LearnerService.completeModule(module.id)
      setIsCompleted(true)
      
      // Auto-navigate to next module if available
      if (nextModule) {
        setTimeout(() => {
          router.push(`/module/${nextModule.id}`)
        }, 1500)
      }
    }
  }

  const handleFeedbackSubmit = (type: 'thumbs-up' | 'thumbs-down', comment?: string) => {
    if (module) {
      FeedbackService.submitFeedback(type, 'module', module.id, comment)
      setFeedbackOpen(false)
    }
  }

  if (!module || !stage) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading module...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => router.push(`/stage/${stage.id}`)}
            className="hover:text-foreground transition-colors"
          >
            {stage.name}
          </button>
          <span>/</span>
          <span className="text-foreground">{module.title}</span>
        </div>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">{module.title}</h1>
              </div>
            </div>
            
            {isCompleted && (
              <Badge variant="default" className="ml-4">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Module Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">Duration:</span>
              <span>{module.estimatedMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Objectives:</span>
              <span>{module.objectives.length} learning objectives</span>
            </div>
            {module.relatedConcepts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Concepts:</span>
                <span>{module.relatedConcepts.length} key concepts</span>
              </div>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
            <CardDescription>What you&apos;ll learn in this module</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {module.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Module Content Sections */}
        <div className="space-y-6 mb-8">
          {module.content.sections.map((section: ContentSection) => (
            <Card key={section.heading}>
              <CardHeader>
                <CardTitle className="text-2xl">{section.heading}</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={section.body} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Examples */}
        {module.content.examples && module.content.examples.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Practical examples to illustrate concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {module.content.examples.map((example, index) => (
                <CodeExample
                  key={`${example.language}-${example.filename || index}`}
                  language={example.language}
                  code={example.code}
                  description={example.description}
                  filename={example.filename}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Diagrams */}
        {module.content.diagrams && module.content.diagrams.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Diagrams</CardTitle>
              <CardDescription>Visual aids to help understand the concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {module.content.diagrams.map((diagram) => (
                <div key={diagram.source} className="p-4 bg-muted rounded-lg border-2 border-dashed border-border">
                  <p className="text-sm text-muted-foreground italic">
                    📊 {diagram.type}: {diagram.alt}
                  </p>
                  {diagram.caption && (
                    <p className="text-xs text-muted-foreground mt-2">{diagram.caption}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Related Concepts */}
        {module.relatedConcepts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Key Concepts</CardTitle>
              <CardDescription>Important concepts covered in this module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {module.relatedConcepts.map((concept) => (
                  <Badge key={concept} variant="secondary">
                    {concept}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {!isCompleted && (
            <Button
              size="lg"
              onClick={handleMarkComplete}
              className="flex-1"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Complete
            </Button>
          )}
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setFeedbackOpen(true)}
            className={!isCompleted ? 'flex-1' : 'w-full'}
          >
            Share Feedback
          </Button>
        </div>

        {/* Module Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => prevModule && router.push(`/module/${prevModule.id}`)}
            disabled={!prevModule}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {prevModule ? prevModule.title : 'Previous Module'}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/stage/${stage.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stage
          </Button>

          <Button
            variant="outline"
            onClick={() => nextModule && router.push(`/module/${nextModule.id}`)}
            disabled={!nextModule}
          >
            {nextModule ? nextModule.title : 'Next Module'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        onSubmit={handleFeedbackSubmit}
        context="module"
        contextName={module.title}
      />
    </div>
  )
}
