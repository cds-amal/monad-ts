import type { PersistedOverrides } from './types'

const STORAGE_KEY = 'ui-config-overrides'

export async function loadOverrides(): Promise<PersistedOverrides> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PersistedOverrides
  } catch {
    return {}
  }
}

export async function saveOverrides(overrides: PersistedOverrides): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Silently fail (quota exceeded, etc.)
  }
}

export async function clearOverrides(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail
  }
}
