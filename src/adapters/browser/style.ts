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
import { colors, spacing, radii, fontSizes, fontWeights, shadows } from './tokens'

// Browser style type
export type BrowserStyle = CSSProperties

// Style composition helper
const merge = (...styles: BrowserStyle[]): BrowserStyle =>
  styles.reduce((acc, s) => ({ ...acc, ...s }), {})

// Intent color mappings
const intentSolid: Record<ColorIntent, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary500, fg: colors.white, border: colors.primary500 },
  success: { bg: colors.success500, fg: colors.white, border: colors.success500 },
  error: { bg: colors.error500, fg: colors.white, border: colors.error500 },
  warning: { bg: colors.warning500, fg: colors.white, border: colors.warning500 },
  neutral: { bg: colors.gray100, fg: colors.gray700, border: colors.gray200 },
}

const intentSoft: Record<ColorIntent, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary100, fg: colors.primary800, border: colors.primary500 },
  success: { bg: colors.success100, fg: colors.success800, border: colors.success500 },
  error: { bg: colors.error100, fg: colors.error800, border: colors.error500 },
  warning: { bg: colors.warning100, fg: colors.warning800, border: colors.warning500 },
  neutral: { bg: colors.gray50, fg: colors.gray700, border: colors.gray200 },
}

// Size mappings
const sizeMap: Record<Size, { fontSize: string; paddingY: string; paddingX: string }> = {
  sm: { fontSize: fontSizes.sm, paddingY: spacing[1], paddingX: spacing[2] },
  md: { fontSize: fontSizes.md, paddingY: spacing[2], paddingX: spacing[4] },
  lg: { fontSize: fontSizes.lg, paddingY: spacing[3], paddingX: spacing[6] },
}

// Browser adapter implementation
export const browserStyleAdapter: StylePort<BrowserStyle> = {
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
        backgroundColor: colors.gray400,
        color: colors.white,
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
    }

    if (disabled) {
      return merge(base, {
        backgroundColor: colors.gray50,
        border: `2px solid ${colors.gray200}`,
        cursor: 'not-allowed',
      })
    }

    if (error) {
      return merge(base, {
        backgroundColor: colors.white,
        border: `2px solid ${colors.error500}`,
      })
    }

    return merge(base, {
      backgroundColor: colors.white,
      border: `2px solid ${colors.gray200}`,
    })
  },

  card(variant: CardVariant = {}): BrowserStyle {
    const { elevated = true } = variant
    const base: BrowserStyle = {
      backgroundColor: colors.white,
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
        backgroundColor: colors.primary100,
        border: `2px solid ${colors.primary500}`,
      })
    }

    return merge(base, {
      backgroundColor: colors.gray50,
      border: '2px solid transparent',
    })
  },

  page(): BrowserStyle {
    return {
      minHeight: '100vh',
      backgroundColor: colors.gray100,
      padding: `${spacing[10]} ${spacing[5]}`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
      color: colors.gray700,
    }
  },

  heading(): BrowserStyle {
    return {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.gray900,
      margin: 0,
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
      border: `2px solid ${colors.gray200}`,
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }

    if (variant.disabled) {
      return merge(base, {
        backgroundColor: colors.gray50,
        cursor: 'not-allowed',
      })
    }

    return merge(base, {
      backgroundColor: colors.white,
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
      backgroundColor: colors.white,
      borderRadius: radii.md,
      border: `2px solid ${colors.gray200}`,
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
      color: colors.gray500,
      backgroundColor: colors.gray50,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: `1px solid ${colors.gray200}`,
    }
  },

  dropdownItem(): BrowserStyle {
    return {
      padding: spacing[3],
      cursor: 'pointer',
      borderBottom: `1px solid ${colors.gray100}`,
      transition: 'background-color 0.15s',
    }
  },

  text(_content: string): BrowserStyle {
    return {}
  },

  compose(...styles: BrowserStyle[]): BrowserStyle {
    return merge(...styles)
  },
}

// Export tokens for direct access when needed
export { colors, spacing, radii, fontSizes, fontWeights, shadows }
