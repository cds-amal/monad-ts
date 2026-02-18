import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react'
import type { UIElementConfig, UIConfigContextValue, PersistedOverrides } from './types'
import { loadOverrides, saveOverrides } from './persistence'

const UIConfigContext = createContext<UIConfigContextValue | null>(null)

export function UIConfigProvider({ children }: { children: ReactNode }) {
  const registry = useRef<Map<string, UIElementConfig>>(new Map())
  const [overrides, setOverrides] = useState<PersistedOverrides>({})
  const [activeElementId, setActiveElementId] = useState<string | null>(null)

  useEffect(() => {
    loadOverrides().then(setOverrides)
  }, [])

  const registerElement = useCallback((config: UIElementConfig) => {
    registry.current.set(config.elementId, config)
  }, [])

  const setOverride = useCallback((elementId: string, propertyKey: string, value: string | number | boolean) => {
    setOverrides(prev => {
      const next = {
        ...prev,
        [elementId]: {
          ...prev[elementId],
          [propertyKey]: value,
        },
      }
      saveOverrides(next)
      return next
    })
  }, [])

  const resetElement = useCallback((elementId: string) => {
    setOverrides(prev => {
      const next = { ...prev }
      delete next[elementId]
      saveOverrides(next)
      return next
    })
  }, [])

  const openDialog = useCallback((elementId: string) => {
    setActiveElementId(elementId)
  }, [])

  const closeDialog = useCallback(() => {
    setActiveElementId(null)
  }, [])

  const value: UIConfigContextValue = {
    registry,
    overrides,
    registerElement,
    setOverride,
    resetElement,
    activeElementId,
    openDialog,
    closeDialog,
  }

  return (
    <UIConfigContext.Provider value={value}>
      {children}
    </UIConfigContext.Provider>
  )
}

export function useUIConfig(): UIConfigContextValue {
  const ctx = useContext(UIConfigContext)
  if (!ctx) {
    throw new Error('useUIConfig must be used within UIConfigProvider')
  }
  return ctx
}
