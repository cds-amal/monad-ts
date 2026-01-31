import React from 'react'
import { Box as MDSBox, Text as MDSText } from '@metamask/design-system-react'
import type { UIAdapter, BoxProps, TextProps, PressableProps, TextInputProps, ScrollViewProps } from './types'

// Web adapter - wraps MetaMask Design System for web platform
export const webAdapter: UIAdapter = {
  Box: function Box({ children, style, className, gap, padding, flexDirection, alignItems, justifyContent, onPress }: BoxProps) {
    const content = (
      <MDSBox
        className={className}
        style={style as React.CSSProperties}
        gap={gap as never}
        padding={padding as never}
        flexDirection={flexDirection as never}
        alignItems={alignItems as never}
        justifyContent={justifyContent as never}
      >
        {children}
      </MDSBox>
    )

    if (onPress) {
      return <button type="button" onClick={onPress} style={{ all: 'unset', cursor: 'pointer' }}>{content}</button>
    }
    return content
  },

  Text: function Text({ children, style, className, color }: TextProps) {
    return (
      <MDSText className={className} style={{ ...style as React.CSSProperties, color }}>
        {children}
      </MDSText>
    )
  },

  Pressable: function Pressable({ children, style, className, onPress, disabled }: PressableProps) {
    return (
      <button
        type="button"
        className={className}
        style={style as React.CSSProperties}
        onClick={onPress}
        disabled={disabled}
      >
        {children}
      </button>
    )
  },

  TextInput: function TextInput({ value, onChangeText, onBlur, placeholder, disabled, style, className, type }: TextInputProps) {
    return (
      <input
        type={type ?? 'text'}
        value={value}
        onChange={e => onChangeText?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        style={style as React.CSSProperties}
      />
    )
  },

  ScrollView: function ScrollView({ children, style, className }: ScrollViewProps) {
    return (
      <div className={className} style={{ overflow: 'auto', ...style as React.CSSProperties }}>
        {children}
      </div>
    )
  },

  applyTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  },

  getSystemTheme: () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },
}
