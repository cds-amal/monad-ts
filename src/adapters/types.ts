import type { ReactNode, CSSProperties } from 'react'

// Cross-platform style type
export type CrossPlatformStyle = CSSProperties | Record<string, unknown>

// Adapter interface - implementations for web and native
export interface UIAdapter {
  // Primitives
  Box: React.ComponentType<BoxProps>
  Text: React.ComponentType<TextProps>
  Pressable: React.ComponentType<PressableProps>
  TextInput: React.ComponentType<TextInputProps>
  ScrollView: React.ComponentType<ScrollViewProps>

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
  margin?: number
  flexDirection?: 'row' | 'column'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  onPress?: () => void
}

export interface TextProps {
  children?: ReactNode
  style?: CrossPlatformStyle
  className?: string
  variant?: 'heading' | 'body' | 'caption'
  color?: string
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
}

export interface ScrollViewProps {
  children?: ReactNode
  style?: CrossPlatformStyle
  className?: string
}
