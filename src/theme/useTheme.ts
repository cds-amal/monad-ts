import { useState, useEffect, useCallback, useMemo } from 'react'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

// Pure functions for theme logic (can be tested independently)
export const ThemeOps = {
  // Detect system preference
  getSystemTheme: (): Theme =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',

  // Resolve preference to actual theme
  resolve: (preference: ThemePreference): Theme =>
    preference === 'system' ? ThemeOps.getSystemTheme() : preference,

  // Toggle between themes
  toggle: (current: Theme): Theme =>
    current === 'light' ? 'dark' : 'light',

  // Persist to localStorage
  save: (preference: ThemePreference): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', preference)
    }
  },

  // Load from localStorage
  load: (): ThemePreference => {
    if (typeof window === 'undefined') return 'system'
    const saved = localStorage.getItem('theme-preference')
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved
    }
    return 'system'
  },

  // Apply theme to DOM
  apply: (theme: Theme): void => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  },
}

interface UseThemeReturn {
  theme: Theme
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
  toggle: () => void
  isDark: boolean
  isLight: boolean
}

// Hook that composes the pure functions
export function useTheme(): UseThemeReturn {
  const [preference, setPreferenceState] = useState<ThemePreference>(ThemeOps.load)
  const theme = useMemo(() => ThemeOps.resolve(preference), [preference])

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    ThemeOps.apply(theme)
  }, [theme])

  // Listen for system theme changes when preference is 'system'
  useEffect(() => {
    if (preference !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      ThemeOps.apply(ThemeOps.getSystemTheme())
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preference])

  const setPreference = useCallback((newPreference: ThemePreference) => {
    setPreferenceState(newPreference)
    ThemeOps.save(newPreference)
  }, [])

  const toggle = useCallback(() => {
    const newTheme = ThemeOps.toggle(theme)
    setPreference(newTheme)
  }, [theme, setPreference])

  return {
    theme,
    preference,
    setPreference,
    toggle,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}
