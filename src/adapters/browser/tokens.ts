/**
 * Browser design tokens - CSS-specific values.
 */

export const colors = {
  // Neutral
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

  // Primary (blue)
  primary50: '#eff6ff',
  primary100: '#dbeafe',
  primary500: '#3b82f6',
  primary600: '#2563eb',
  primary700: '#1d4ed8',
  primary800: '#1e40af',

  // Success (green)
  success50: '#ecfdf5',
  success100: '#d1fae5',
  success500: '#10b981',
  success600: '#059669',
  success700: '#047857',
  success800: '#065f46',

  // Error (red)
  error50: '#fef2f2',
  error100: '#fee2e2',
  error500: '#ef4444',
  error600: '#dc2626',
  error700: '#b91c1c',
  error800: '#991b1b',

  // Warning (amber)
  warning50: '#fffbeb',
  warning100: '#fef3c7',
  warning500: '#f59e0b',
  warning600: '#d97706',
  warning800: '#92400e',

  // Info (pink)
  info50: '#fdf2f8',
  info100: '#fce7f3',
  info500: '#ec4899',
  info800: '#9d174d',
} as const

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
