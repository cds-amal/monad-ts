import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }, [])

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    // Fallback for when not in provider (shouldn't happen in normal use)
    return {
      theme: 'light',
      toggleTheme: () => {},
      isDark: false,
      isLight: true,
    }
  }
  return ctx
}

// Renamed for compatibility with existing code
export { useTheme as default }
export const toggle = () => {} // placeholder for old API
