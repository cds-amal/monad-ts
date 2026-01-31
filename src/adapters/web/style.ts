import { CSSProperties } from 'react'
import type { StyleAdapter, Style } from '../types'

// Convert React Native style shortcuts to web CSS
function normalizeRNStyles(style: Record<string, unknown>): CSSProperties {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(style)) {
    switch (key) {
      // Padding shortcuts
      case 'paddingVertical':
        result.paddingTop = value
        result.paddingBottom = value
        break
      case 'paddingHorizontal':
        result.paddingLeft = value
        result.paddingRight = value
        break
      // Margin shortcuts
      case 'marginVertical':
        result.marginTop = value
        result.marginBottom = value
        break
      case 'marginHorizontal':
        result.marginLeft = value
        result.marginRight = value
        break
      // Border shortcuts
      case 'borderTopWidth':
      case 'borderBottomWidth':
      case 'borderLeftWidth':
      case 'borderRightWidth':
        result[key] = value
        break
      case 'borderTopColor':
      case 'borderBottomColor':
      case 'borderLeftColor':
      case 'borderRightColor':
        result[key] = value
        break
      // RN uses borderWidth for all sides
      case 'borderWidth':
        result.borderWidth = value
        result.borderStyle = result.borderStyle || 'solid'
        break
      case 'borderColor':
        result.borderColor = value
        break
      // Handle fontWeight as string (RN style)
      case 'fontWeight':
        result.fontWeight = typeof value === 'string' ? parseInt(value) || value : value
        break
      // textTransform needs to be handled
      case 'textTransform':
        result.textTransform = value
        break
      // Default: pass through
      default:
        result[key] = value
    }
  }

  // Ensure flexbox defaults match RN (column) - but only if display is flex
  if (result.gap !== undefined || result.flexDirection !== undefined) {
    result.display = result.display || 'flex'
    result.flexDirection = result.flexDirection || 'column'
  }

  return result as CSSProperties
}

export const webStyleAdapter: StyleAdapter = {
  normalize: (style: CSSProperties): Style => normalizeRNStyles(style as Record<string, unknown>),

  shadow: (elevation: number, color = 'rgba(0, 0, 0, 0.1)'): Style => ({
    boxShadow: `0 ${elevation}px ${elevation * 2}px ${color}`,
  }),

  monoFont: () => 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
}
