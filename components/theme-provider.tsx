'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // After mounting, we have access to the client-side environment
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration issues by rendering only after client-side hydration is complete
  if (!mounted) {
    // Return a placeholder with the same structure as the children
    return (
      <div style={{ visibility: 'hidden' }} aria-hidden="true" suppressHydrationWarning>
        {children}
      </div>
    )
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}
