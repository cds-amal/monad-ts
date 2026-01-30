import { createContext, useContext, ReactNode } from 'react'
import type { Adapter, RenderAdapter, StyleAdapter } from '../adapters/types'
import { webAdapter } from '../adapters/web'

// Default to web adapter - native entry point will override
const AdapterContext = createContext<Adapter>(webAdapter)

interface AdapterProviderProps {
  adapter: Adapter
  children: ReactNode
}

export function AdapterProvider({ adapter, children }: AdapterProviderProps) {
  return (
    <AdapterContext.Provider value={adapter}>
      {children}
    </AdapterContext.Provider>
  )
}

// Hook to get the full adapter
export function useAdapter(): Adapter {
  return useContext(AdapterContext)
}

// Hook to get render primitives
export function useRender(): RenderAdapter {
  return useContext(AdapterContext).render
}

// Hook to get style adapter
export function useStyle(): StyleAdapter {
  return useContext(AdapterContext).style
}

// Hook to check platform
export function usePlatform(): 'web' | 'native' {
  return useContext(AdapterContext).platform
}

// Convenience hook that returns everything commonly needed
export function usePrimitives() {
  const adapter = useContext(AdapterContext)
  return {
    ...adapter.render,
    style: adapter.style,
    platform: adapter.platform,
  }
}
