import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SessionInitializer } from '@/components/SessionInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCP Learning Platform - Master the Model Context Protocol',
  description: 'Educational platform for learning MCP with interactive quizzes, staged progression, and comprehensive concept coverage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <SessionInitializer />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}

