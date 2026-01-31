import { createContext, useContext, ReactNode } from 'react'
import { FeatureFlags, defaultFlags } from './types'

const FeatureFlagsContext = createContext<FeatureFlags>(defaultFlags)

interface FeatureFlagsProviderProps {
  flags?: Partial<FeatureFlags>
  children: ReactNode
}

/**
 * Provider for feature flags.
 * Pass partial flags to override defaults.
 */
export function FeatureFlagsProvider({ flags, children }: FeatureFlagsProviderProps) {
  const mergedFlags = { ...defaultFlags, ...flags }

  return (
    <FeatureFlagsContext.Provider value={mergedFlags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

/**
 * Hook to access all feature flags.
 */
export function useFeatureFlags(): FeatureFlags {
  return useContext(FeatureFlagsContext)
}

/**
 * Hook to access a single feature flag by key.
 */
export function useFeatureFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  const flags = useContext(FeatureFlagsContext)
  return flags[key]
}
