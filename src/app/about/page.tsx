'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Code, Zap, Target, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationHeader } from '@/components/NavigationHeader'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

          <h1 className="text-4xl font-bold mb-2">About This Platform</h1>
          <p className="text-muted-foreground">
            Learn about the MCP Learning Platform and how it works
          </p>
        </div>

        {/* What is this */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              What is the MCP Learning Platform?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              The MCP Learning Platform is an interactive educational application designed to teach you everything about the <strong>Model Context Protocol (MCP)</strong>. Through a structured, stage-based learning path, you&apos;ll progress from fundamental concepts to advanced implementation patterns.
            </p>
            <p className="text-sm leading-relaxed">
              This platform combines theoretical knowledge with practical understanding, using interactive quizzes and real-world examples to reinforce learning. Whether you&apos;re new to MCP or looking to deepen your expertise, our progressive curriculum adapts to your learning journey.
            </p>
          </CardContent>
        </Card>

        {/* Learning Approach */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Our Learning Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Progressive Stages</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn through 5 carefully designed stages: Foundations → Architecture & Messages → Advanced Patterns → Building & Debugging → Mastery
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Interactive Quizzes</h4>
                  <p className="text-sm text-muted-foreground">
                    Test your understanding with quizzes at the end of each stage. Pass with 70% or higher to unlock the next stage and track your progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Hands-On Examples</h4>
                  <p className="text-sm text-muted-foreground">
                    Explore real code examples in TypeScript, Python, and C# to see MCP implementations in action across different languages and frameworks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Progress Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your learning journey with detailed analytics including completion rates, quiz scores, and time invested in learning.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="text-primary">✓</div>
                <div>
                  <p className="font-medium text-sm">Session-Based Learning</p>
                  <p className="text-xs text-muted-foreground">Pick up where you left off within your session</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="text-primary">✓</div>
                <div>
                  <p className="font-medium text-sm">Unlimited Quiz Retakes</p>
                  <p className="text-xs text-muted-foreground">Practice until you master each concept</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="text-primary">✓</div>
                <div>
                  <p className="font-medium text-sm">Adaptive Recommendations</p>
                  <p className="text-xs text-muted-foreground">Get personalized suggestions based on quiz performance</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="text-primary">✓</div>
                <div>
                  <p className="font-medium text-sm">Modern Design</p>
                  <p className="text-xs text-muted-foreground">Clean, accessible interface with dark mode support</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="text-primary">✓</div>
                <div>
                  <p className="font-medium text-sm">Multi-Language Examples</p>
                  <p className="text-xs text-muted-foreground">Code samples in TypeScript, Python, and C#</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="text-primary">✓</div>
                <div>
                  <p className="font-medium text-sm">Concept Knowledge Map</p>
                  <p className="text-xs text-muted-foreground">Visualize relationships between MCP concepts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stack */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Technical Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">Framework</p>
                <p className="text-muted-foreground">Next.js 15</p>
              </div>
              <div>
                <p className="font-medium">Language</p>
                <p className="text-muted-foreground">TypeScript</p>
              </div>
              <div>
                <p className="font-medium">Styling</p>
                <p className="text-muted-foreground">Tailwind CSS</p>
              </div>
              <div>
                <p className="font-medium">UI Components</p>
                <p className="text-muted-foreground">shadcn/ui</p>
              </div>
              <div>
                <p className="font-medium">Storage</p>
                <p className="text-muted-foreground">Session Storage</p>
              </div>
              <div>
                <p className="font-medium">Deployment</p>
                <p className="text-muted-foreground">Static Export</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MCP Specification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About the Model Context Protocol</CardTitle>
            <CardDescription>Official specification and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). All learning content in this platform is based on the official MCP specification.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.open('https://modelcontextprotocol.io', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Website
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/modelcontextprotocol', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="leading-relaxed">
              This platform uses <strong>session storage only</strong> to track your progress. No data is sent to external servers or persisted beyond your current browser session.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              When you close your browser or end your session, all progress data is automatically cleared. There are no user accounts, no cookies, and no tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
