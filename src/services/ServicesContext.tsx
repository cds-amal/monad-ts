import { createContext, useContext, ReactNode } from 'react'
import type { Services } from './types'

const ServicesContext = createContext<Services | null>(null)

interface ServicesProviderProps {
  services: Services
  children: ReactNode
}

export function ServicesProvider({ services, children }: ServicesProviderProps) {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices(): Services {
  const ctx = useContext(ServicesContext)
  if (!ctx) {
    throw new Error('useServices must be used within ServicesProvider')
  }
  return ctx
}
