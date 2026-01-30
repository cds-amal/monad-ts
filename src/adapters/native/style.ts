import { CSSProperties } from 'react'
import { Platform } from 'react-native'
import type { StyleAdapter, Style } from '../types'

// Properties that don't exist or work differently in React Native
const WEB_ONLY_PROPERTIES = [
  'cursor',
  'transition',
  'boxShadow',
  'outline',
  'textTransform',
  'wordBreak',
  'textOverflow',
  'whiteSpace',
  'WebkitLineClamp',
  'WebkitBoxOrient',
] as const

// Convert web boxShadow to RN shadow properties
function parseBoxShadow(boxShadow: string | undefined): Style {
  if (!boxShadow || boxShadow === 'none') return {}

  // Simple parser for common format: "0 4px 6px rgba(0, 0, 0, 0.1)"
  const match = boxShadow.match(/(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+(rgba?\([^)]+\)|#[a-fA-F0-9]+)/)
  if (!match) return {}

  const [, x, y, blur, color] = match
  return {
    shadowColor: color || '#000',
    shadowOffset: { width: parseInt(x), height: parseInt(y) },
    shadowOpacity: 0.25,
    shadowRadius: parseInt(blur) / 2,
    elevation: Math.max(1, Math.ceil(parseInt(blur) / 2)), // Android
  }
}

export const nativeStyleAdapter: StyleAdapter = {
  normalize: (style: CSSProperties): Style => {
    const result: Style = {}

    for (const [key, value] of Object.entries(style)) {
      // Skip web-only properties
      if (WEB_ONLY_PROPERTIES.includes(key as typeof WEB_ONLY_PROPERTIES[number])) {
        // Convert boxShadow to native shadow
        if (key === 'boxShadow' && typeof value === 'string') {
          Object.assign(result, parseBoxShadow(value))
        }
        continue
      }

      // Convert web font stack to platform font
      if (key === 'fontFamily' && typeof value === 'string') {
        if (value.includes('monospace') || value.includes('Menlo') || value.includes('Monaco')) {
          result.fontFamily = Platform.select({
            ios: 'Menlo',
            android: 'monospace',
            default: 'monospace',
          })
          continue
        }
      }

      // Convert textAlign on non-text elements (will be ignored, but keep for Text)
      // This is handled by the component

      // Pass through other properties
      ;(result as Record<string, unknown>)[key] = value
    }

    return result
  },

  shadow: (elevation: number, color = '#000'): Style => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: elevation / 2 },
    shadowOpacity: 0.25,
    shadowRadius: elevation,
    elevation, // Android
  }),

  monoFont: () => Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
}
