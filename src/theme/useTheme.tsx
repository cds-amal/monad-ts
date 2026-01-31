import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useEnvironment } from '../environment'

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
  const { isDev } = useEnvironment()
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    if (isDev) {
      throw new Error('useTheme must be used within ThemeProvider')
    }
    console.warn('useTheme: ThemeProvider missing')
    return { theme: 'light', toggleTheme: () => {}, isDark: false, isLight: true }
  }
  return ctx
}

export { useTheme as default }
