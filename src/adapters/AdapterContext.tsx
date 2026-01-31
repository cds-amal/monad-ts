import React, { createContext, useContext, useMemo } from 'react'
import type { UIAdapter } from './types'
import { Platform } from './platform'
import { webAdapter } from './web'
import { nativeAdapter } from './native'

const AdapterContext = createContext<UIAdapter | null>(null)

interface AdapterProviderProps {
  children: React.ReactNode
  adapter?: UIAdapter // Allow override for testing
}

export function AdapterProvider({ children, adapter }: AdapterProviderProps) {
  const resolvedAdapter = useMemo(() => {
    if (adapter) return adapter
    return Platform.select({ web: webAdapter, native: nativeAdapter })
  }, [adapter])

  return (
    <AdapterContext.Provider value={resolvedAdapter}>
      {children}
    </AdapterContext.Provider>
  )
}

export function useAdapter(): UIAdapter {
  const adapter = useContext(AdapterContext)
  if (!adapter) {
    // Fallback to web adapter if not in provider (for SSR or testing)
    return webAdapter
  }
  return adapter
}

// Convenience hooks for individual primitives
export function usePrimitives() {
  const adapter = useAdapter()
  return {
    Box: adapter.Box,
    Text: adapter.Text,
    Pressable: adapter.Pressable,
    TextInput: adapter.TextInput,
    ScrollView: adapter.ScrollView,
  }
}

export function useThemeAdapter() {
  const adapter = useAdapter()
  return {
    applyTheme: adapter.applyTheme,
    getSystemTheme: adapter.getSystemTheme,
  }
}
