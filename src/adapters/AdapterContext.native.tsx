/**
 * React Native AdapterContext
 *
 * This version doesn't import webAdapter to avoid bundling MDS dependencies
 * that have crypto libraries incompatible with React Native.
 */

import React, { createContext, useContext } from 'react'
import type { UIAdapter } from './types'
import { nativeAdapter } from './native'

const AdapterContext = createContext<UIAdapter | null>(null)

interface AdapterProviderProps {
  children: React.ReactNode
  adapter?: UIAdapter
}

export function AdapterProvider({ children, adapter }: AdapterProviderProps) {
  const resolvedAdapter = adapter ?? nativeAdapter

  return (
    <AdapterContext.Provider value={resolvedAdapter}>
      {children}
    </AdapterContext.Provider>
  )
}

export function useAdapter(): UIAdapter {
  const adapter = useContext(AdapterContext)
  if (!adapter) {
    return nativeAdapter
  }
  return adapter
}

export function usePrimitives() {
  const adapter = useAdapter()
  return {
    Box: adapter.Box,
    Text: adapter.Text,
    Pressable: adapter.Pressable,
    TextInput: adapter.TextInput,
    ScrollView: adapter.ScrollView,
    Button: adapter.Button,
    IconButton: adapter.IconButton,
  }
}

export function useThemeAdapter() {
  const adapter = useAdapter()
  return {
    applyTheme: adapter.applyTheme,
    getSystemTheme: adapter.getSystemTheme,
  }
}
