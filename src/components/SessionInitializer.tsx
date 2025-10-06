'use client'

import { useEffect } from 'react'

/**
 * SessionInitializer - Initializes session timestamp on first app load
 * This component ensures sessionStartTime is set in sessionStorage
 * when the user first visits the application
 */
export function SessionInitializer() {
  useEffect(() => {
    // Initialize session start time if not already set
    if (typeof window !== 'undefined' && !sessionStorage.getItem('sessionStartTime')) {
      sessionStorage.setItem('sessionStartTime', Date.now().toString())
    }
  }, [])

  return null // This component doesn't render anything
}
