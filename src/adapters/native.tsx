/**
 * React Native Adapter
 *
 * Provides cross-platform primitives using React Native components
 * styled with MetaMask Design System tokens for consistency.
 * Tested on iOS simulator via Expo.
 */

import React, { forwardRef, useState } from 'react'
import {
  View,
  Text as RNText,
  Pressable as RNPressable,
  TextInput as RNTextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useTheme } from '../theme/useTheme'
import type {
  UIAdapter,
  BoxProps,
  TextProps,
  PressableProps,
  TextInputProps,
  ScrollViewProps,
  ButtonProps,
  IconButtonProps,
  TextVariant,
  SemanticColor,
  BackgroundColor,
  BorderColor,
  ButtonVariant,
  ButtonSize,
  IconName,
} from './types'

// Hardcoded MDS tokens (avoids importing @metamask/design-tokens which has crypto deps)
const lightTheme = {
  colors: {
    text: { default: '#121314', alternative: '#686e7d', muted: '#b7bbc8' },
    background: { default: '#ffffff', alternative: '#f3f5f9', muted: '#3c4d9d0f', pressed: '#858b9a29' },
    border: { default: '#b7bbc8', muted: '#b7bbc866' },
    primary: { default: '#4459ff', muted: '#4459ff1a' },
    error: { default: '#ca3542', muted: '#ca35421a' },
    success: { default: '#457a39', muted: '#457a391a' },
    warning: { default: '#9a6300', muted: '#9a63001a' },
    info: { default: '#4459ff', muted: '#4459ff1a' },
  }
}

const darkTheme = {
  colors: {
    text: { default: '#ffffff', alternative: '#9ca1af', muted: '#4b505c' },
    background: { default: '#121314', alternative: '#000000', muted: '#e0e5ff14', pressed: '#dadce514' },
    border: { default: '#858b9a', muted: '#858b9a33' },
    primary: { default: '#8b99ff', muted: '#8b99ff26' },
    error: { default: '#ff7584', muted: '#ff758426' },
    success: { default: '#baf24a', muted: '#baf24a26' },
    warning: { default: '#f0b034', muted: '#f0b03426' },
    info: { default: '#8b99ff', muted: '#8b99ff26' },
  }
}

// Get theme tokens based on theme state
const getThemeTokens = (isDark: boolean) => {
  return isDark ? darkTheme : lightTheme
}

// Hook to get current theme tokens
const useThemeTokens = () => {
  const { isDark } = useTheme()
  return getThemeTokens(isDark)
}

// Map semantic text colors to theme tokens
const getTextColor = (color: SemanticColor | undefined, tokens: typeof lightTheme) => {
  const colorMap: Record<SemanticColor, string> = {
    default: tokens.colors.text.default,
    alternative: tokens.colors.text.alternative,
    muted: tokens.colors.text.muted,
    primary: tokens.colors.primary.default,
    error: tokens.colors.error.default,
    success: tokens.colors.success.default,
    warning: tokens.colors.warning.default,
    info: tokens.colors.info.default,
  }
  return color ? colorMap[color] : tokens.colors.text.default
}

// Map background colors to theme tokens
const getBackgroundColor = (bg: BackgroundColor | undefined, tokens: typeof lightTheme) => {
  const bgMap: Record<BackgroundColor, string> = {
    default: tokens.colors.background.default,
    alternative: tokens.colors.background.alternative,
    muted: tokens.colors.background.muted,
    primaryMuted: tokens.colors.primary.muted,
    errorMuted: tokens.colors.error.muted,
    successMuted: tokens.colors.success.muted,
    warningMuted: tokens.colors.warning.muted,
    infoMuted: tokens.colors.info.muted,
  }
  return bg ? bgMap[bg] : undefined
}

// Map border colors to theme tokens
const getBorderColor = (border: BorderColor | undefined, tokens: typeof lightTheme) => {
  const borderMap: Record<BorderColor, string> = {
    default: tokens.colors.border.default,
    muted: tokens.colors.border.muted,
    primary: tokens.colors.primary.default,
    error: tokens.colors.error.default,
    success: tokens.colors.success.default,
    warning: tokens.colors.warning.default,
    info: tokens.colors.info.default,
    transparent: 'transparent',
  }
  return border ? borderMap[border] : undefined
}

// Typography variants
const getTextVariantStyle = (variant: TextVariant) => {
  const styles: Record<TextVariant, object> = {
    headingLg: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    headingMd: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
    headingSm: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    bodyLg: { fontSize: 18, fontWeight: '400', lineHeight: 26 },
    bodyMd: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodySm: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    bodyXs: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  }
  return styles[variant] || styles.bodyMd
}

// Font weight mapping
const getFontWeight = (weight: string | undefined) => {
  const map: Record<string, string> = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
  return weight ? map[weight] : undefined
}

// Button style types
interface ButtonStyleResult {
  backgroundColor: string
  color: string
  fontSize: number
  paddingVertical: number
  paddingHorizontal: number
  borderWidth?: number
  borderColor?: string
  opacity: number
  borderRadius: number
  alignItems: 'center'
  justifyContent: 'center'
  flexDirection: 'row'
}

// Button styles
const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, disabled: boolean, tokens: typeof lightTheme): ButtonStyleResult => {

  const variantStyles: Record<ButtonVariant, { backgroundColor: string; color: string; borderWidth?: number; borderColor?: string }> = {
    primary: {
      backgroundColor: tokens.colors.primary.default,
      color: '#FFFFFF',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: tokens.colors.primary.default,
      color: tokens.colors.primary.default,
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: tokens.colors.primary.default,
    },
    danger: {
      backgroundColor: tokens.colors.error.default,
      color: '#FFFFFF',
    },
  }

  const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 },
  }

  return {
    ...variantStyles[variant],
    ...sizeStyles[size],
    opacity: disabled ? 0.5 : 1,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
  }
}

// Simple icon components (emoji-based for demo, would use react-native-vector-icons in production)
const iconMap: Record<IconName, string> = {
  wallet: '👛',
  light: '☀️',
  dark: '🌙',
  close: '✕',
  check: '✓',
  warning: '⚠️',
  info: 'ℹ️',
  error: '❌',
}

const Box = forwardRef<View, BoxProps>(({
  children,
  style,
  gap,
  padding,
  paddingVertical,
  paddingHorizontal,
  margin,
  marginVertical,
  marginHorizontal,
  marginBottom,
  flexDirection,
  alignItems,
  justifyContent,
  backgroundColor,
  borderWidth,
  borderColor,
  borderRadius,
  onPress,
}, ref) => {
  const tokens = useThemeTokens()
  const computedStyle = {
    ...(gap !== undefined && { gap }),
    ...(padding !== undefined && { padding }),
    ...(paddingVertical !== undefined && { paddingVertical }),
    ...(paddingHorizontal !== undefined && { paddingHorizontal }),
    ...(margin !== undefined && { margin }),
    ...(marginVertical !== undefined && { marginVertical }),
    ...(marginHorizontal !== undefined && { marginHorizontal }),
    ...(marginBottom !== undefined && { marginBottom }),
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(backgroundColor && { backgroundColor: getBackgroundColor(backgroundColor, tokens) }),
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderColor && { borderColor: getBorderColor(borderColor, tokens) }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(style as object),
  }

  if (onPress) {
    return (
      <RNPressable ref={ref} style={computedStyle} onPress={onPress}>
        {children}
      </RNPressable>
    )
  }

  return <View ref={ref} style={computedStyle}>{children}</View>
})
Box.displayName = 'Box'

const Text = forwardRef<RNText, TextProps>(({
  children,
  style,
  variant = 'bodyMd',
  color,
  fontWeight,
  fontFamily,
}, ref) => {
  const tokens = useThemeTokens()
  const variantStyle = getTextVariantStyle(variant)
  const textColor = getTextColor(color, tokens)
  const weight = getFontWeight(fontWeight)

  return (
    <RNText
      ref={ref}
      style={[
        variantStyle,
        { color: textColor },
        weight && { fontWeight: weight as never },
        fontFamily === 'mono' && { fontFamily: 'Menlo' },
        style as object,
      ]}
    >
      {children}
    </RNText>
  )
})
Text.displayName = 'Text'

const Pressable = forwardRef<View, PressableProps>(({
  children,
  style,
  onPress,
  disabled,
}, ref) => {
  const [pressed, setPressed] = useState(false)

  return (
    <RNPressable
      ref={ref}
      style={[
        style as object,
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
    >
      {children}
    </RNPressable>
  )
})
Pressable.displayName = 'Pressable'

const TextInput = forwardRef<RNTextInput, TextInputProps>(({
  value,
  onChangeText,
  onBlur,
  placeholder,
  disabled,
  style,
  type,
  hasError,
}, ref) => {
  const tokens = useThemeTokens()
  const borderColor = hasError ? tokens.colors.error.default : tokens.colors.border.default

  return (
    <RNTextInput
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={tokens.colors.text.muted}
      editable={!disabled}
      keyboardType={type === 'number' ? 'numeric' : 'default'}
      secureTextEntry={type === 'password'}
      style={[
        {
          borderWidth: 2,
          borderColor,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          color: tokens.colors.text.default,
          backgroundColor: tokens.colors.background.default,
        },
        disabled && { opacity: 0.5, backgroundColor: tokens.colors.background.alternative },
        style as object,
      ]}
    />
  )
})
TextInput.displayName = 'TextInput'

const ScrollBox = forwardRef<ScrollView, ScrollViewProps>(({
  children,
  style,
}, ref) => {
  return (
    <ScrollView ref={ref} style={style as object}>
      {children}
    </ScrollView>
  )
})
ScrollBox.displayName = 'ScrollBox'

const Button = forwardRef<View, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading,
  loadingText,
  fullWidth,
}, ref) => {
  const [pressed, setPressed] = useState(false)
  const tokens = useThemeTokens()
  const buttonStyle = getButtonStyles(variant, size, disabled || loading || false, tokens)

  return (
    <RNPressable
      ref={ref}
      style={[
        buttonStyle,
        fullWidth && { width: '100%' },
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'tertiary' ? tokens.colors.primary.default : '#FFFFFF'}
          style={{ marginRight: 8 }}
        />
      )}
      <RNText style={{ color: buttonStyle.color, fontSize: buttonStyle.fontSize, fontWeight: '600' }}>
        {loading && loadingText ? loadingText : children}
      </RNText>
    </RNPressable>
  )
})
Button.displayName = 'Button'

const IconButton = forwardRef<View, IconButtonProps>(({
  icon,
  size = 'md',
  onPress,
  disabled,
  label,
}, ref) => {
  const [pressed, setPressed] = useState(false)
  const tokens = useThemeTokens()

  const sizeMap: Record<ButtonSize, number> = { sm: 32, md: 40, lg: 48 }
  const fontSizeMap: Record<ButtonSize, number> = { sm: 16, md: 20, lg: 24 }

  return (
    <RNPressable
      ref={ref}
      style={[
        {
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: sizeMap[size] / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tokens.colors.background.muted,
        },
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      accessibilityLabel={label}
    >
      <RNText style={{ fontSize: fontSizeMap[size] }}>{iconMap[icon]}</RNText>
    </RNPressable>
  )
})
IconButton.displayName = 'IconButton'

export const nativeAdapter: UIAdapter = {
  Box: Box as React.ComponentType<BoxProps>,
  Text: Text as React.ComponentType<TextProps>,
  Pressable: Pressable as React.ComponentType<PressableProps>,
  TextInput: TextInput as React.ComponentType<TextInputProps>,
  ScrollView: ScrollBox as React.ComponentType<ScrollViewProps>,
  Button: Button as React.ComponentType<ButtonProps>,
  IconButton: IconButton as React.ComponentType<IconButtonProps>,

  // Theme is now managed via ThemeProvider context, these are no-ops
  applyTheme: () => {},
  getSystemTheme: () => 'light',
}
