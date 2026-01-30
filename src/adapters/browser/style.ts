/**
 * Browser StyleAdapter - implements StylePort for CSS/DOM.
 */

import { CSSProperties } from 'react'
import {
  StylePort,
  ButtonVariant,
  BadgeVariant,
  InputVariant,
  CardVariant,
  AlertVariant,
  SelectableVariant,
  DropdownVariant,
  ColorIntent,
  Size,
} from '../../ports'
import { colors, spacing, radii, fontSizes, fontWeights, shadows, themeColors, SemanticColors, Theme } from './tokens'

// Browser style type
export type BrowserStyle = CSSProperties

// Style composition helper
const merge = (...styles: BrowserStyle[]): BrowserStyle =>
  styles.reduce((acc, s) => ({ ...acc, ...s }), {})

// Create intent mappings based on theme
function createIntentSolid(c: SemanticColors): Record<ColorIntent, { bg: string; fg: string; border: string }> {
  return {
    primary: { bg: c.primary, fg: '#ffffff', border: c.primary },
    success: { bg: c.success, fg: '#ffffff', border: c.success },
    error: { bg: c.error, fg: '#ffffff', border: c.error },
    warning: { bg: c.warning, fg: '#ffffff', border: c.warning },
    neutral: { bg: c.neutralSoft, fg: c.neutralSoftText, border: c.border },
  }
}

function createIntentSoft(c: SemanticColors): Record<ColorIntent, { bg: string; fg: string; border: string }> {
  return {
    primary: { bg: c.primarySoft, fg: c.primarySoftText, border: c.primary },
    success: { bg: c.successSoft, fg: c.successSoftText, border: c.success },
    error: { bg: c.errorSoft, fg: c.errorSoftText, border: c.error },
    warning: { bg: c.warningSoft, fg: c.warningSoftText, border: c.warning },
    neutral: { bg: c.neutralSoft, fg: c.neutralSoftText, border: c.border },
  }
}

// Size mappings
const sizeMap: Record<Size, { fontSize: string; paddingY: string; paddingX: string }> = {
  sm: { fontSize: fontSizes.sm, paddingY: spacing[1], paddingX: spacing[2] },
  md: { fontSize: fontSizes.md, paddingY: spacing[2], paddingX: spacing[4] },
  lg: { fontSize: fontSizes.lg, paddingY: spacing[3], paddingX: spacing[6] },
}

// Factory to create theme-aware style adapter
export function createStyleAdapter(theme: Theme): StylePort<BrowserStyle> {
  const c = themeColors[theme]
  const intentSolid = createIntentSolid(c)
  const intentSoft = createIntentSoft(c)

  return {
    button(variant: ButtonVariant = {}): BrowserStyle {
      const { intent = 'primary', size = 'md', disabled, loading } = variant
      const intentStyle = intentSolid[intent]
      const sizeStyle = sizeMap[size]

      const base: BrowserStyle = {
        padding: `${sizeStyle.paddingY} ${sizeStyle.paddingX}`,
        fontSize: sizeStyle.fontSize,
        fontWeight: fontWeights.semibold,
        borderRadius: radii.md,
        border: 'none',
        transition: 'all 0.2s ease',
      }

      if (disabled || loading) {
        return merge(base, {
          backgroundColor: c.textMuted,
          color: '#ffffff',
          cursor: loading ? 'wait' : 'not-allowed',
        })
      }

      return merge(base, {
        backgroundColor: intentStyle.bg,
        color: intentStyle.fg,
        cursor: 'pointer',
      })
    },

    badge(variant: BadgeVariant = {}): BrowserStyle {
      const { intent = 'neutral', size = 'sm' } = variant
      const intentStyle = intentSoft[intent]
      const sizeStyle = sizeMap[size]

      return {
        padding: `${sizeStyle.paddingY} ${sizeStyle.paddingX}`,
        fontSize: sizeStyle.fontSize,
        fontWeight: fontWeights.semibold,
        borderRadius: radii.sm,
        backgroundColor: intentStyle.bg,
        color: intentStyle.fg,
        border: `1px solid ${intentStyle.border}`,
      }
    },

    input(variant: InputVariant = {}): BrowserStyle {
      const { size = 'md', error, disabled } = variant
      const sizeStyle = sizeMap[size]

      const base: BrowserStyle = {
        padding: `${sizeStyle.paddingY} ${sizeStyle.paddingX}`,
        fontSize: sizeStyle.fontSize,
        borderRadius: radii.md,
        outline: 'none',
        transition: 'border-color 0.2s ease',
        color: c.text,
      }

      if (disabled) {
        return merge(base, {
          backgroundColor: c.bgMuted,
          border: `2px solid ${c.border}`,
          cursor: 'not-allowed',
        })
      }

      if (error) {
        return merge(base, {
          backgroundColor: c.bgCard,
          border: `2px solid ${c.error}`,
        })
      }

      return merge(base, {
        backgroundColor: c.bgCard,
        border: `2px solid ${c.border}`,
      })
    },

    card(variant: CardVariant = {}): BrowserStyle {
      const { elevated = true } = variant
      const base: BrowserStyle = {
        backgroundColor: c.bgCard,
        borderRadius: radii.lg,
        padding: spacing[6],
      }
      return elevated ? merge(base, { boxShadow: shadows.md }) : base
    },

    alert(variant: AlertVariant = {}): BrowserStyle {
      const { intent = 'neutral' } = variant
      const intentStyle = intentSoft[intent]

      return {
        padding: spacing[4],
        borderRadius: radii.md,
        backgroundColor: intentStyle.bg,
        color: intentStyle.fg,
        border: `2px solid ${intentStyle.border}`,
      }
    },

    selectable(variant: SelectableVariant = {}): BrowserStyle {
      const { selected } = variant
      const base: BrowserStyle = {
        padding: spacing[4],
        borderRadius: radii.md,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }

      if (selected) {
        return merge(base, {
          backgroundColor: c.primarySoft,
          border: `2px solid ${c.primary}`,
        })
      }

      return merge(base, {
        backgroundColor: c.bgMuted,
        border: '2px solid transparent',
      })
    },

    page(): BrowserStyle {
      return {
        minHeight: '100vh',
        backgroundColor: c.bg,
        padding: `${spacing[10]} ${spacing[5]}`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: c.text,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }
    },

    container(): BrowserStyle {
      return {
        maxWidth: '480px',
        margin: '0 auto',
      }
    },

    label(): BrowserStyle {
      return {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: c.textSecondary,
      }
    },

    heading(): BrowserStyle {
      return {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: c.text,
        margin: 0,
      }
    },

    divider(): BrowserStyle {
      return {
        backgroundColor: c.border,
        height: '1px',
        width: '100%',
      }
    },

    dropdownContainer(): BrowserStyle {
      return { position: 'relative' }
    },

    dropdownTrigger(variant: DropdownVariant = {}): BrowserStyle {
      const base: BrowserStyle = {
        width: '100%',
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: fontSizes.md,
        borderRadius: radii.md,
        border: `2px solid ${c.border}`,
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: c.text,
      }

      if (variant.disabled) {
        return merge(base, {
          backgroundColor: c.bgMuted,
          cursor: 'not-allowed',
        })
      }

      return merge(base, {
        backgroundColor: c.bgCard,
        cursor: 'pointer',
      })
    },

    dropdownMenu(): BrowserStyle {
      return {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: spacing[1],
        backgroundColor: c.bgCard,
        borderRadius: radii.md,
        border: `2px solid ${c.border}`,
        boxShadow: shadows.lg,
        zIndex: 50,
        maxHeight: '300px',
        overflowY: 'auto',
      }
    },

    dropdownGroup(): BrowserStyle {
      return {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        color: c.textMuted,
        backgroundColor: c.bgMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: `1px solid ${c.border}`,
      }
    },

    dropdownItem(): BrowserStyle {
      return {
        padding: spacing[3],
        cursor: 'pointer',
        borderBottom: `1px solid ${c.borderMuted}`,
        transition: 'background-color 0.15s',
        color: c.text,
      }
    },

    text(_content: string): BrowserStyle {
      return { color: c.text }
    },

    compose(...styles: BrowserStyle[]): BrowserStyle {
      return merge(...styles)
    },
  }
}

// Default adapter (light theme) for backwards compatibility
export const browserStyleAdapter = createStyleAdapter('light')

// Export tokens for direct access when needed
export { colors, spacing, radii, fontSizes, fontWeights, shadows, themeColors }
export type { Theme, SemanticColors }
