/**
 * Adapter Context - Dependency injection for hexagonal architecture.
 * Components consume adapters through this context, making them platform-agnostic.
 */

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { StylePort, Web3Port } from '../ports'
import { BrowserStyle, createStyleAdapter, browserWeb3Adapter, Theme, themeColors } from '../adapters/browser'

// Theme context type
interface ThemeState {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  colors: typeof themeColors.light
}

// Adapter bundle type
export interface Adapters {
  style: StylePort<BrowserStyle>
  web3: Web3Port
}

// Contexts
const ThemeContext = createContext<ThemeState>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  colors: themeColors.light,
})

const AdapterContext = createContext<Adapters>({
  style: createStyleAdapter('light'),
  web3: browserWeb3Adapter,
})

// Provider component
interface AdapterProviderProps {
  initialTheme?: Theme
  children: ReactNode
}

export function AdapterProvider({ initialTheme = 'light', children }: AdapterProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  const themeState = useMemo<ThemeState>(() => ({
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    colors: themeColors[theme],
  }), [theme])

  const adapters = useMemo<Adapters>(() => ({
    style: createStyleAdapter(theme),
    web3: browserWeb3Adapter,
  }), [theme])

  return (
    <ThemeContext.Provider value={themeState}>
      <AdapterContext.Provider value={adapters}>
        {children}
      </AdapterContext.Provider>
    </ThemeContext.Provider>
  )
}

// Hooks to consume adapters
export function useAdapters(): Adapters {
  return useContext(AdapterContext)
}

export function useStyle(): StylePort<BrowserStyle> {
  return useContext(AdapterContext).style
}

export function useWeb3(): Web3Port {
  return useContext(AdapterContext).web3
}

// Theme hooks
export function useTheme(): ThemeState {
  return useContext(ThemeContext)
}
