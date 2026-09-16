'use client'

import { useEffect } from 'react'

export default function PrintTrigger() {
  useEffect(() => {
    // Small delay to allow images to load
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return null
}
