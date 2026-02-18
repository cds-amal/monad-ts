import type { ReactNode, CSSProperties } from 'react'

// Cross-platform style type
export type CrossPlatformStyle = CSSProperties | Record<string, unknown>

// Semantic text variants (maps to MDS TextVariant on web)
export type TextVariant = 'headingLg' | 'headingMd' | 'headingSm' | 'bodyLg' | 'bodyMd' | 'bodySm' | 'bodyXs'

// Semantic colors (maps to MDS color tokens)
export type SemanticColor =
  | 'default'
  | 'alternative'
  | 'muted'
  | 'primary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'

// Background variants
export type BackgroundColor =
  | 'default'
  | 'alternative'
  | 'muted'
  | 'primaryMuted'
  | 'errorMuted'
  | 'successMuted'
  | 'warningMuted'
  | 'infoMuted'

// Border variants
export type BorderColor =
  | 'default'
  | 'muted'
  | 'primary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'transparent'

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Icon names (subset of MDS icons)
export type IconName = 'wallet' | 'light' | 'dark' | 'close' | 'check' | 'warning' | 'info' | 'error'

// Adapter interface - implementations for web and native
export interface UIAdapter {
  // Primitives
  Box: React.ComponentType<BoxProps>
  Text: React.ComponentType<TextProps>
  Pressable: React.ComponentType<PressableProps>
  TextInput: React.ComponentType<TextInputProps>
  ScrollView: React.ComponentType<ScrollViewProps>
  Button: React.ComponentType<ButtonProps>
  IconButton: React.ComponentType<IconButtonProps>

  // Theme
  applyTheme: (theme: 'light' | 'dark') => void
  getSystemTheme: () => 'light' | 'dark'
}

// Primitive prop types
export interface BoxProps {
  children?: ReactNode
  style?: CrossPlatformStyle
  className?: string // Web only, ignored on native
  gap?: number
  padding?: number
  paddingVertical?: number
  paddingHorizontal?: number
  margin?: number
  marginVertical?: number
  marginHorizontal?: number
  marginBottom?: number
  marginTop?: number
  flexDirection?: 'row' | 'column'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  backgroundColor?: BackgroundColor
  borderWidth?: number
  borderColor?: BorderColor
  borderRadius?: number
  onPress?: () => void

  // Positioning
  position?: 'relative' | 'absolute'
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  zIndex?: number

  // Flex extensions
  flex?: number
  flexWrap?: 'wrap' | 'nowrap'
  flexGrow?: number

  // Sizing
  width?: number | string
  height?: number | string
  maxWidth?: number | string
  minWidth?: number | string
  maxHeight?: number | string
  minHeight?: number | string

  // Overflow
  overflow?: 'hidden' | 'visible' | 'scroll'

  // Visual
  opacity?: number

  // Directional borders
  borderBottomWidth?: number
  borderBottomColor?: BorderColor
  borderTopWidth?: number
  borderTopColor?: BorderColor
}

export interface TextProps {
  children?: ReactNode
  style?: CrossPlatformStyle
  className?: string
  variant?: TextVariant
  color?: SemanticColor
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  fontFamily?: 'default' | 'mono'
  textAlign?: 'left' | 'center' | 'right'
}

export interface PressableProps {
  children?: ReactNode
  style?: CrossPlatformStyle
  className?: string
  onPress?: () => void
  disabled?: boolean
}

export interface TextInputProps {
  value?: string
  onChangeText?: (text: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  style?: CrossPlatformStyle
  className?: string
  type?: 'text' | 'number' | 'password'
  hasError?: boolean
}

export interface ScrollViewProps {
  children?: ReactNode
  style?: CrossPlatformStyle
  className?: string
}

export interface ButtonProps {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

export interface IconButtonProps {
  icon: IconName
  size?: ButtonSize
  onPress?: () => void
  disabled?: boolean
  label: string // Accessibility
}
