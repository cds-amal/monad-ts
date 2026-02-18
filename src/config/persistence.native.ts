import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PersistedOverrides } from './types'

const STORAGE_KEY = 'ui-config-overrides'

export async function loadOverrides(): Promise<PersistedOverrides> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PersistedOverrides
  } catch {
    return {}
  }
}

export async function saveOverrides(overrides: PersistedOverrides): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Silently fail
  }
}

export async function clearOverrides(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail
  }
}
