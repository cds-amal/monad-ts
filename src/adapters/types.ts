import { ReactNode, CSSProperties } from 'react'

// Platform-agnostic style type
export type Style = CSSProperties & {
  // RN-specific properties (optional on web)
  shadowColor?: string
  shadowOffset?: { width: number; height: number }
  shadowOpacity?: number
  shadowRadius?: number
  elevation?: number
}

// Primitive component props
export interface BoxProps {
  style?: Style
  children?: ReactNode
  onPress?: () => void
  testID?: string
}

export interface TextProps {
  style?: Style
  children?: ReactNode
  numberOfLines?: number
  testID?: string
}

export interface PressableProps {
  style?: Style | ((state: { pressed: boolean; hovered: boolean }) => Style)
  children?: ReactNode | ((state: { pressed: boolean; hovered: boolean }) => ReactNode)
  onPress?: () => void
  onHoverIn?: () => void
  onHoverOut?: () => void
  disabled?: boolean
  testID?: string
}

export interface TextInputProps {
  style?: Style
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  placeholderTextColor?: string
  editable?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  testID?: string
}

export interface ScrollBoxProps {
  style?: Style
  contentContainerStyle?: Style
  children?: ReactNode
  testID?: string
}

// Adapter interface - what each platform must implement
export interface RenderAdapter {
  Box: React.ComponentType<BoxProps>
  Text: React.ComponentType<TextProps>
  Pressable: React.ComponentType<PressableProps>
  TextInput: React.ComponentType<TextInputProps>
  ScrollBox: React.ComponentType<ScrollBoxProps>
}

export interface StyleAdapter {
  // Transform web CSS to platform-appropriate styles
  normalize: (style: CSSProperties) => Style
  // Platform-specific shadow creation
  shadow: (elevation: number, color?: string) => Style
  // Platform-specific font
  monoFont: () => string
  // Select platform-specific styles (like Platform.select in RN)
  select: <T>(options: { web?: T; native?: T; default?: T }) => T | undefined
}

export interface Adapter {
  render: RenderAdapter
  style: StyleAdapter
  platform: 'web' | 'native'
}
