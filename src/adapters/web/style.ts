import { CSSProperties } from 'react'
import type { StyleAdapter, Style } from '../types'

export const webStyleAdapter: StyleAdapter = {
  // Web styles pass through unchanged
  normalize: (style: CSSProperties): Style => style,

  // Web shadow using boxShadow
  shadow: (elevation: number, color = 'rgba(0, 0, 0, 0.1)'): Style => ({
    boxShadow: `0 ${elevation}px ${elevation * 2}px ${color}`,
  }),

  // Web monospace font
  monoFont: () => 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
}
