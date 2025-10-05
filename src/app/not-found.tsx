'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

/**
 * 404 Not Found Page
 * 
 * Displayed when a user navigates to a route that doesn't exist.
 * Provides helpful navigation options to get back on track.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
            <div>
              <CardTitle className="text-3xl">404 - Page Not Found</CardTitle>
              <CardDescription className="text-base mt-1">
                The page you're looking for doesn't exist or has been moved.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg space-y-3">
            <h3 className="font-semibold">Common Reasons:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>The URL was typed incorrectly</li>
              <li>The page has been removed or renamed</li>
              <li>The link you followed is outdated</li>
              <li>You don't have permission to access this page</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">What you can do:</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="default" className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
            <h3 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
              Need Help?
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              If you believe this is an error, please check the URL or return to the homepage 
              to start your MCP learning journey.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
