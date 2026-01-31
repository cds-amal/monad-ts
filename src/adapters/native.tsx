/**
 * React Native Adapter (Placeholder)
 *
 * This file shows the structure for a React Native adapter.
 * In a real implementation, this would import from 'react-native'.
 *
 * To complete:
 * 1. npm install react-native
 * 2. Replace placeholder implementations with actual RN components
 */

import React from 'react'
import type { UIAdapter, BoxProps, TextProps, PressableProps, TextInputProps, ScrollViewProps } from './types'

// Placeholder implementations that mirror RN API
// In real implementation, these would be:
// import { View, Text, Pressable, TextInput, ScrollView, Appearance } from 'react-native'

const View: React.FC<{ style?: unknown; children?: React.ReactNode }> = ({ children }) => <>{children}</>
const RNText: React.FC<{ style?: unknown; children?: React.ReactNode }> = ({ children }) => <>{children}</>
const RNPressable: React.FC<{ style?: unknown; onPress?: () => void; disabled?: boolean; children?: React.ReactNode }> =
  ({ children }) => <>{children}</>
const RNTextInput: React.FC<{
  value?: string
  onChangeText?: (text: string) => void
  onBlur?: () => void
  placeholder?: string
  editable?: boolean
  style?: unknown
}> = () => null
const RNScrollView: React.FC<{ style?: unknown; children?: React.ReactNode }> = ({ children }) => <>{children}</>

// Mock Appearance API
const Appearance = {
  getColorScheme: () => 'light' as 'light' | 'dark',
  setColorScheme: (_scheme: 'light' | 'dark') => {},
}

export const nativeAdapter: UIAdapter = {
  Box: function Box({ children, style, gap, padding, flexDirection, alignItems, justifyContent, onPress }: BoxProps) {
    const computedStyle = {
      gap,
      padding,
      flexDirection,
      alignItems,
      justifyContent,
      ...style,
    }

    if (onPress) {
      return (
        <RNPressable style={computedStyle} onPress={onPress}>
          {children}
        </RNPressable>
      )
    }

    return <View style={computedStyle}>{children}</View>
  },

  Text: function Text({ children, style, color }: TextProps) {
    return <RNText style={{ ...style, color }}>{children}</RNText>
  },

  Pressable: function Pressable({ children, style, onPress, disabled }: PressableProps) {
    return (
      <RNPressable style={style} onPress={onPress} disabled={disabled}>
        {children}
      </RNPressable>
    )
  },

  TextInput: function TextInput({ value, onChangeText, onBlur, placeholder, disabled, style }: TextInputProps) {
    return (
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        editable={!disabled}
        style={style}
      />
    )
  },

  ScrollView: function ScrollView({ children, style }: ScrollViewProps) {
    return <RNScrollView style={style}>{children}</RNScrollView>
  },

  applyTheme: (theme) => {
    Appearance.setColorScheme(theme)
  },

  getSystemTheme: () => {
    return Appearance.getColorScheme() ?? 'light'
  },
}
