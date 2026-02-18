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
import { lightTheme, darkTheme, ThemeTokens } from './tokens.native'
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

// Get theme tokens based on theme state
const getThemeTokens = (isDark: boolean) => {
  return isDark ? darkTheme : lightTheme
}

// Hook to get current theme tokens
const useThemeTokens = () => {
  const { isDark } = useTheme()
  return getThemeTokens(isDark)
}

// Generic color mapper factory
const createColorMapper = <T extends string>(
  getColorMap: (tokens: ThemeTokens) => Record<T, string>,
  defaultKey?: T
) => (value: T | undefined, tokens: ThemeTokens): string | undefined => {
  const map = getColorMap(tokens)
  return value ? map[value] : (defaultKey ? map[defaultKey] : undefined)
}

// Map semantic text colors to theme tokens
const getTextColor = createColorMapper<SemanticColor>(
  (tokens) => ({
    default: tokens.colors.text.default,
    alternative: tokens.colors.text.alternative,
    muted: tokens.colors.text.muted,
    primary: tokens.colors.primary.default,
    error: tokens.colors.error.default,
    success: tokens.colors.success.default,
    warning: tokens.colors.warning.default,
    info: tokens.colors.info.default,
  }),
  'default'
)

// Map background colors to theme tokens
const getBackgroundColor = createColorMapper<BackgroundColor>(
  (tokens) => ({
    default: tokens.colors.background.default,
    alternative: tokens.colors.background.alternative,
    muted: tokens.colors.background.muted,
    primaryMuted: tokens.colors.primary.muted,
    errorMuted: tokens.colors.error.muted,
    successMuted: tokens.colors.success.muted,
    warningMuted: tokens.colors.warning.muted,
    infoMuted: tokens.colors.info.muted,
  })
)

// Map border colors to theme tokens
const getBorderColor = createColorMapper<BorderColor>(
  (tokens) => ({
    default: tokens.colors.border.default,
    muted: tokens.colors.border.muted,
    primary: tokens.colors.primary.default,
    error: tokens.colors.error.default,
    success: tokens.colors.success.default,
    warning: tokens.colors.warning.default,
    info: tokens.colors.info.default,
    transparent: 'transparent',
  })
)

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
const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, disabled: boolean, tokens: ThemeTokens): ButtonStyleResult => {

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

// Reusable hook for press state management
const usePressedState = (pressedOpacity = 0.7) => {
  const [pressed, setPressed] = useState(false)
  return {
    pressed,
    pressHandlers: {
      onPressIn: () => setPressed(true),
      onPressOut: () => setPressed(false),
    },
    pressedStyle: pressed ? { opacity: pressedOpacity } : undefined,
  }
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
  marginTop,
  flexDirection,
  alignItems,
  justifyContent,
  backgroundColor,
  borderWidth,
  borderColor,
  borderRadius,
  onPress,
  position,
  top,
  right,
  bottom,
  left,
  zIndex,
  flex,
  flexWrap,
  flexGrow,
  width,
  height,
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
  overflow,
  opacity,
  borderBottomWidth,
  borderBottomColor,
  borderTopWidth,
  borderTopColor,
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
    ...(marginTop !== undefined && { marginTop }),
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(backgroundColor && { backgroundColor: getBackgroundColor(backgroundColor, tokens) }),
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderColor && { borderColor: getBorderColor(borderColor, tokens) }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(position && { position }),
    ...(top !== undefined && { top }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    ...(zIndex !== undefined && { zIndex }),
    ...(flex !== undefined && { flex }),
    ...(flexWrap && { flexWrap }),
    ...(flexGrow !== undefined && { flexGrow }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(minWidth !== undefined && { minWidth }),
    ...(maxHeight !== undefined && { maxHeight }),
    ...(minHeight !== undefined && { minHeight }),
    ...(overflow && { overflow }),
    ...(opacity !== undefined && { opacity }),
    ...(borderBottomWidth !== undefined && { borderBottomWidth }),
    ...(borderBottomColor && { borderBottomColor: getBorderColor(borderBottomColor, tokens) }),
    ...(borderTopWidth !== undefined && { borderTopWidth }),
    ...(borderTopColor && { borderTopColor: getBorderColor(borderTopColor, tokens) }),
    ...(style as object),
  }

  if (onPress) {
    return (
      <RNPressable ref={ref} style={computedStyle as object} onPress={onPress}>
        {children}
      </RNPressable>
    )
  }

  return <View ref={ref} style={computedStyle as object}>{children}</View>
})
Box.displayName = 'Box'

const Text = forwardRef<RNText, TextProps>(({
  children,
  style,
  variant = 'bodyMd',
  color,
  fontWeight,
  fontFamily,
  textAlign,
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
        textAlign && { textAlign },
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
  const { pressHandlers, pressedStyle } = usePressedState()

  return (
    <RNPressable
      ref={ref}
      style={[
        style as object,
        pressedStyle,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      {...pressHandlers}
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
  const { pressHandlers, pressedStyle } = usePressedState(0.8)
  const tokens = useThemeTokens()
  const buttonStyle = getButtonStyles(variant, size, disabled || loading || false, tokens)

  return (
    <RNPressable
      ref={ref}
      style={[
        buttonStyle,
        fullWidth && { width: '100%' },
        pressedStyle,
      ]}
      onPress={onPress}
      {...pressHandlers}
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
  const { pressHandlers, pressedStyle } = usePressedState()
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
        pressedStyle,
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      {...pressHandlers}
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
