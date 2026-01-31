import { createContext, useContext, ReactNode } from 'react'
import { Environment, createEnvironment } from './types'

// Default to production for safety if no provider
const defaultEnvironment = createEnvironment('production', 'web')

const EnvironmentContext = createContext<Environment>(defaultEnvironment)

interface EnvironmentProviderProps {
  environment: Environment
  children: ReactNode
}

export function EnvironmentProvider({ environment, children }: EnvironmentProviderProps) {
  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment(): Environment {
  return useContext(EnvironmentContext)
}
