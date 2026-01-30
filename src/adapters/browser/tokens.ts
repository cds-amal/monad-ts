/**
 * Browser design tokens - CSS-specific values.
 */

// Raw color palette
const palette = {
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  primary50: '#eff6ff',
  primary100: '#dbeafe',
  primary400: '#60a5fa',
  primary500: '#3b82f6',
  primary600: '#2563eb',
  primary700: '#1d4ed8',
  primary800: '#1e40af',
  success50: '#ecfdf5',
  success100: '#d1fae5',
  success400: '#34d399',
  success500: '#10b981',
  success600: '#059669',
  success700: '#047857',
  success800: '#065f46',
  error50: '#fef2f2',
  error100: '#fee2e2',
  error400: '#f87171',
  error500: '#ef4444',
  error600: '#dc2626',
  error700: '#b91c1c',
  error800: '#991b1b',
  warning50: '#fffbeb',
  warning100: '#fef3c7',
  warning400: '#fbbf24',
  warning500: '#f59e0b',
  warning600: '#d97706',
  warning800: '#92400e',
  info50: '#fdf2f8',
  info100: '#fce7f3',
  info500: '#ec4899',
  info800: '#9d174d',
} as const

// Theme type
export type Theme = 'light' | 'dark'

// Semantic color mappings per theme
export interface SemanticColors {
  // Backgrounds
  bg: string
  bgCard: string
  bgHover: string
  bgMuted: string
  // Text
  text: string
  textSecondary: string
  textMuted: string
  // Border
  border: string
  borderMuted: string
  // Semantic - solid backgrounds
  primary: string
  success: string
  error: string
  warning: string
  // Semantic - soft backgrounds (for badges, alerts)
  primarySoft: string
  primarySoftText: string
  successSoft: string
  successSoftText: string
  errorSoft: string
  errorSoftText: string
  warningSoft: string
  warningSoftText: string
  neutralSoft: string
  neutralSoftText: string
}

export const themeColors: Record<Theme, SemanticColors> = {
  light: {
    bg: palette.gray100,
    bgCard: palette.white,
    bgHover: palette.gray50,
    bgMuted: palette.gray50,
    text: palette.gray900,
    textSecondary: palette.gray700,
    textMuted: palette.gray500,
    border: palette.gray200,
    borderMuted: palette.gray100,
    primary: palette.primary500,
    success: palette.success500,
    error: palette.error500,
    warning: palette.warning500,
    primarySoft: palette.primary100,
    primarySoftText: palette.primary800,
    successSoft: palette.success100,
    successSoftText: palette.success800,
    errorSoft: palette.error100,
    errorSoftText: palette.error800,
    warningSoft: palette.warning100,
    warningSoftText: palette.warning800,
    neutralSoft: palette.gray50,
    neutralSoftText: palette.gray700,
  },
  dark: {
    bg: palette.gray900,
    bgCard: palette.gray800,
    bgHover: palette.gray700,
    bgMuted: palette.gray700,
    text: palette.gray50,
    textSecondary: palette.gray300,
    textMuted: palette.gray400,
    border: palette.gray600,
    borderMuted: palette.gray700,
    primary: palette.primary400,
    success: palette.success400,
    error: palette.error400,
    warning: palette.warning400,
    primarySoft: palette.primary800,
    primarySoftText: palette.primary100,
    successSoft: palette.success800,
    successSoftText: palette.success100,
    errorSoft: palette.error800,
    errorSoftText: palette.error100,
    warningSoft: palette.warning800,
    warningSoftText: palette.warning100,
    neutralSoft: palette.gray700,
    neutralSoftText: palette.gray300,
  },
}

// Default export for backwards compatibility
export const colors = palette

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const

export const radii = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
} as const

export const fontSizes = {
  xs: '10px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '24px',
} as const

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const
