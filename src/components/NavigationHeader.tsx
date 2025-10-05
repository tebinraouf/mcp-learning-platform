/**
 * NavigationHeader - Top navigation bar with progress and theme toggle
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Menu, X, BookOpen, BarChart3, MapIcon, Info } from 'lucide-react'

interface NavigationHeaderProps {
  overallProgress?: number
  currentStage?: string
}

export function NavigationHeader({
  overallProgress = 0,
  currentStage,
}: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Home', icon: BookOpen },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
    { href: '/knowledge-map', label: 'Knowledge Map', icon: MapIcon },
    { href: '/about', label: 'About', icon: Info },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-blue-600 dark:text-blue-400">MCP</span>
            <span>Learning Platform</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive(link.href) ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Progress bar */}
        {overallProgress > 0 && (
          <div className="pb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {currentStage ? `Current: ${currentStage}` : 'Overall Progress'}
              </span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-1" />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(link.href) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
