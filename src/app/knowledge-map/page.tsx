'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ContentService } from '@/services'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationHeader } from '@/components/NavigationHeader'
import { KnowledgeMap } from '@/components/KnowledgeMap'

export const dynamic = 'force-dynamic'

interface ConceptNode {
  id: string
  name: string
  category: string
  mastery?: number
  relatedConcepts: string[]
}

export default function KnowledgeMapPage() {
  const router = useRouter()
  const [concepts, setConcepts] = useState<ConceptNode[]>([])

  useEffect(() => {
    const getCategoryFromId = (id: string): string => {
      if (id.includes('protocol') || id.includes('json-rpc')) return 'protocol'
      if (id.includes('transport') || id.includes('stdio') || id.includes('sse')) return 'transport'
      if (id.includes('security') || id.includes('auth')) return 'security'
      if (id.includes('server') || id.includes('client') || id.includes('implementation')) return 'implementation'
      return 'patterns'
    }

    const allConceptIds = ContentService.getAllConcepts()
    
    // Build concept nodes from the IDs
    // Since we don't have full concept data, we'll create simplified nodes
    const conceptNodes: ConceptNode[] = allConceptIds.map(id => ({
      id,
      name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      category: getCategoryFromId(id),
      relatedConcepts: [],
      mastery: 0
    }))
    
    setConcepts(conceptNodes)
  }, [])

  const handleConceptClick = (conceptId: string) => {
    // Find modules related to this concept
    const relatedModules = ContentService.searchContent(conceptId)
    if (relatedModules.modules.length > 0) {
      router.push(`/module/${relatedModules.modules[0].module.id}`)
    }
  }

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

          <h1 className="text-4xl font-bold mb-2">MCP Knowledge Map</h1>
          <p className="text-muted-foreground">
            Explore the interconnected concepts of the Model Context Protocol
          </p>
        </div>

        {/* Knowledge Map Visualization */}
          <Card className="p-6">
            <p className="text-muted-foreground">
              Visualizing {concepts.length} MCP concepts organized by category and mastery level
            </p>
          </Card>

          <div className="mt-8">
            <KnowledgeMap
              concepts={concepts}
              onConceptClick={handleConceptClick}
            />
          </div>        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use the Knowledge Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="leading-relaxed">
              The knowledge map visualizes all MCP concepts covered in this learning platform. Concepts are grouped by category and color-coded by your mastery level:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span><strong>Green:</strong> Strong understanding (based on quiz performance)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span><strong>Yellow:</strong> Moderate understanding</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span><strong>Red:</strong> Needs review or not yet studied</span>
              </li>
            </ul>
            <p className="leading-relaxed mt-4">
              Click on any concept to navigate to related learning modules and deepen your understanding of that topic.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
