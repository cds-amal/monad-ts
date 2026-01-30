/**
 * Adapter Context - Dependency injection for hexagonal architecture.
 * Components consume adapters through this context, making them platform-agnostic.
 */

import { createContext, useContext, ReactNode } from 'react'
import { StylePort, Web3Port } from '../ports'
import { BrowserStyle, browserStyleAdapter, browserWeb3Adapter } from '../adapters/browser'

// Adapter bundle type
export interface Adapters {
  style: StylePort<BrowserStyle>
  web3: Web3Port
}

// Default adapters (browser)
const defaultAdapters: Adapters = {
  style: browserStyleAdapter,
  web3: browserWeb3Adapter,
}

// Context
const AdapterContext = createContext<Adapters>(defaultAdapters)

// Provider component
interface AdapterProviderProps {
  adapters?: Partial<Adapters>
  children: ReactNode
}

export function AdapterProvider({ adapters, children }: AdapterProviderProps) {
  const mergedAdapters: Adapters = {
    ...defaultAdapters,
    ...adapters,
  }

  return (
    <AdapterContext.Provider value={mergedAdapters}>
      {children}
    </AdapterContext.Provider>
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
