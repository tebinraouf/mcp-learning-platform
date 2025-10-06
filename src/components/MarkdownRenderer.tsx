'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * MarkdownRenderer - Renders markdown content with GitHub Flavored Markdown support
 * and Mermaid diagram rendering.
 * 
 * Features:
 * - GitHub Flavored Markdown (tables, task lists, strikethrough, etc.)
 * - Mermaid diagram rendering (lazy-loaded for performance)
 * - Syntax highlighting for code blocks
 * - Accessible semantic HTML output
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically import mermaid only when needed
    const renderMermaidDiagrams = async () => {
      if (!containerRef.current) return
      
      const mermaidElements = containerRef.current.querySelectorAll('code.language-mermaid')
      if (mermaidElements.length === 0) return

      // Lazy load mermaid
      const mermaid = (await import('mermaid')).default
      
      // Initialize Mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      })

      // Render all mermaid diagrams in the container
      mermaidElements.forEach(async (element, index) => {
        const code = element.textContent || ''
        const id = `mermaid-md-${Date.now()}-${index}`
        const container = document.createElement('div')
        container.className = 'mermaid-container my-6 bg-background p-6 rounded-lg border border-border overflow-x-auto'
        
        try {
          // Render the mermaid diagram
          const { svg } = await mermaid.render(id, code)
          container.innerHTML = svg
          element.parentElement?.replaceWith(container)
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          container.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50 dark:bg-red-950">
            <p class="font-semibold">Failed to render diagram</p>
            <p class="text-sm mt-1">${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>`
          element.parentElement?.replaceWith(container)
        }
      })
    }

    renderMermaidDiagrams()
  }, [content])

  const components: Components = {
    // Custom rendering for code blocks to handle mermaid
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      const inline = !className
      
      if (!inline && language === 'mermaid') {
        // Mermaid diagrams will be rendered by useEffect
        return (
          <pre className={className}>
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        )
      }
      
      // Regular code blocks
      if (inline) {
        return (
          <code className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
            {children}
          </code>
        )
      }
      
      return (
        <pre className="bg-gray-100 border border-gray-300 text-gray-900 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 rounded-lg p-4 overflow-x-auto font-mono text-sm leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      )
    },
    
    // Tables with responsive wrapper
    table({ children }) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="min-w-full divide-y divide-border">
            {children}
          </table>
        </div>
      )
    },
    
    th({ children }) {
      return (
        <th className="px-4 py-3 text-left text-sm font-semibold bg-muted">
          {children}
        </th>
      )
    },
    
    td({ children }) {
      return (
        <td className="px-4 py-3 text-sm border-t border-border">
          {children}
        </td>
      )
    },
    
    // Task lists
    input({ type, checked, disabled }) {
      if (type === 'checkbox') {
        return (
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="mr-2 rounded border-border"
            readOnly
          />
        )
      }
      return null
    },
    
    // Links with proper accessibility
    a({ href, children }) {
      return (
        <a
          href={href}
          className="text-primary underline hover:text-primary/80 transition-colors"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
    
    // Blockquotes
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/50 rounded-r">
          {children}
        </blockquote>
      )
    },
    
    // Headings with proper hierarchy
    h1({ children }) {
      return <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
    },
    h2({ children }) {
      return <h2 className="text-3xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
    },
    h3({ children }) {
      return <h3 className="text-2xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>
    },
    h4({ children }) {
      return <h4 className="text-xl font-semibold mt-4 mb-2 text-foreground">{children}</h4>
    },
    h5({ children }) {
      return <h5 className="text-lg font-semibold mt-3 mb-2 text-foreground">{children}</h5>
    },
    h6({ children }) {
      return <h6 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h6>
    },
  }

  return (
    <div ref={containerRef} className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
