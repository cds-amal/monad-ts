import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const isDark = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// Color mappings for light/dark
export const colors = {
  light: {
    bg: '#f3f4f6',
    bgCard: '#ffffff',
    bgHover: '#f9fafb',
    bgSelected: '#dbeafe',
    bgInput: '#ffffff',
    bgDisabled: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    borderSelected: '#3b82f6',
    primary: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    successBg: '#d1fae5',
    successText: '#065f46',
    errorBg: '#fee2e2',
    errorText: '#991b1b',
    warningBg: '#dbeafe',
    warningText: '#1e40af',
  },
  dark: {
    bg: '#111827',
    bgCard: '#1f2937',
    bgHover: '#374151',
    bgSelected: '#1e3a5f',
    bgInput: '#374151',
    bgDisabled: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    border: '#4b5563',
    borderSelected: '#3b82f6',
    primary: '#60a5fa',
    success: '#34d399',
    error: '#f87171',
    successBg: '#064e3b',
    successText: '#6ee7b7',
    errorBg: '#7f1d1d',
    errorText: '#fca5a5',
    warningBg: '#1e3a5f',
    warningText: '#93c5fd',
  },
}

export function useColors() {
  const { isDark } = useTheme()
  return isDark ? colors.dark : colors.light
}
