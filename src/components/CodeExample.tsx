'use client'

import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'

interface CodeExampleProps {
  language: string
  code: string
  description?: string
  filename?: string
}

/**
 * CodeExample - Renders code examples with special handling for Mermaid diagrams
 */
export function CodeExample({ language, code, description, filename }: CodeExampleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMermaid = language === 'mermaid'

  useEffect(() => {
    if (!isMermaid || !containerRef.current) return

    const renderMermaid = async () => {
      try {
        // Lazy load mermaid
        const mermaid = (await import('mermaid')).default
        
        // Initialize Mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        })

        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, code)
        
        if (containerRef.current) {
          const svgContainer = containerRef.current.querySelector('.mermaid-svg-container')
          if (svgContainer) {
            svgContainer.innerHTML = svg
          }
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        if (containerRef.current) {
          const svgContainer = containerRef.current.querySelector('.mermaid-svg-container')
          if (svgContainer) {
            svgContainer.innerHTML = `
              <div class="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-950">
                <p class="font-semibold">Failed to render diagram</p>
                <p class="text-sm mt-1">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            `
          }
        }
      }
    }

    renderMermaid()
  }, [code, isMermaid])

  return (
    <div ref={containerRef} className="space-y-2">
      {filename && (
        <h4 className="text-sm font-semibold text-muted-foreground">
          {filename}
        </h4>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {isMermaid ? (
        <div className="mermaid-svg-container bg-background p-6 rounded-lg border border-border overflow-x-auto">
          <div className="flex items-center justify-center min-h-[200px]">
            <span className="text-muted-foreground animate-pulse">Loading diagram...</span>
          </div>
        </div>
      ) : (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">{code}</code>
        </pre>
      )}
      
      <Badge variant="outline" className="text-xs">
        {language}
      </Badge>
    </div>
  )
}
