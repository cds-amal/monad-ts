import { useEffect, useCallback } from 'react'
import { useFeatureFlag } from '../features'
import { useUIConfig } from './UIConfigContext'
import type { UIElementConfig, ConfigProperty } from './types'

interface UseConfigurableOptions {
  elementId: string
  elementType: string
  displayName: string
  properties: Record<string, ConfigProperty>
}

interface UseConfigurableResult {
  values: Record<string, string | number | boolean>
  onLongPress: () => void
}

export function useConfigurable(options: UseConfigurableOptions): UseConfigurableResult {
  const enableUIConfig = useFeatureFlag('enableUIConfig')
  const { overrides, registerElement, openDialog } = useUIConfig()

  const config: UIElementConfig = {
    elementId: options.elementId,
    elementType: options.elementType,
    displayName: options.displayName,
    properties: options.properties,
  }

  useEffect(() => {
    registerElement(config)
  }, [options.elementId])

  const onLongPress = useCallback(() => {
    if (enableUIConfig) {
      openDialog(options.elementId)
    }
  }, [enableUIConfig, openDialog, options.elementId])

  // Resolve values: overrides take precedence, fall back to currentValue from property definitions
  const values: Record<string, string | number | boolean> = {}
  const elementOverrides = overrides[options.elementId]
  for (const [key, prop] of Object.entries(options.properties)) {
    if (elementOverrides && key in elementOverrides) {
      values[key] = elementOverrides[key] as string | number | boolean
    } else {
      values[key] = prop.currentValue
    }
  }

  return { values, onLongPress }
}
