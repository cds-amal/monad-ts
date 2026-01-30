import { forwardRef, useState } from 'react'
import {
  View,
  Text as RNText,
  Pressable as RNPressable,
  TextInput as RNTextInput,
  ScrollView,
  Platform,
} from 'react-native'
import type {
  RenderAdapter,
  BoxProps,
  TextProps,
  PressableProps,
  TextInputProps,
  ScrollBoxProps,
} from '../types'

const Box = forwardRef<View, BoxProps>(({ style, children, onPress, testID }, ref) => {
  if (onPress) {
    return (
      <RNPressable ref={ref} style={style} onPress={onPress} testID={testID}>
        {children}
      </RNPressable>
    )
  }
  return (
    <View ref={ref} style={style} testID={testID}>
      {children}
    </View>
  )
})
Box.displayName = 'Box'

const Text = forwardRef<RNText, TextProps>(({ style, children, numberOfLines, testID }, ref) => {
  return (
    <RNText ref={ref} style={style} numberOfLines={numberOfLines} testID={testID}>
      {children}
    </RNText>
  )
})
Text.displayName = 'Text'

const Pressable = forwardRef<View, PressableProps>(({
  style,
  children,
  onPress,
  disabled,
  testID,
}, ref) => {
  const [pressed, setPressed] = useState(false)
  // Note: hovered is always false on native (no mouse)
  const hovered = false

  const computedStyle = typeof style === 'function' ? style({ pressed, hovered }) : style
  const computedChildren = typeof children === 'function' ? children({ pressed, hovered }) : children

  return (
    <RNPressable
      ref={ref}
      style={computedStyle}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      testID={testID}
    >
      {computedChildren}
    </RNPressable>
  )
})
Pressable.displayName = 'Pressable'

const TextInput = forwardRef<RNTextInput, TextInputProps>(({
  style,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  editable = true,
  keyboardType = 'default',
  autoCapitalize,
  testID,
}, ref) => {
  return (
    <RNTextInput
      ref={ref}
      style={style}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      editable={editable}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      testID={testID}
    />
  )
})
TextInput.displayName = 'TextInput'

const ScrollBox = forwardRef<ScrollView, ScrollBoxProps>(({
  style,
  contentContainerStyle,
  children,
  testID,
}, ref) => {
  return (
    <ScrollView
      ref={ref}
      style={style}
      contentContainerStyle={contentContainerStyle}
      testID={testID}
    >
      {children}
    </ScrollView>
  )
})
ScrollBox.displayName = 'ScrollBox'

export const nativeRenderAdapter: RenderAdapter = {
  Box: Box as React.ComponentType<BoxProps>,
  Text: Text as React.ComponentType<TextProps>,
  Pressable: Pressable as React.ComponentType<PressableProps>,
  TextInput: TextInput as React.ComponentType<TextInputProps>,
  ScrollBox: ScrollBox as React.ComponentType<ScrollBoxProps>,
}
