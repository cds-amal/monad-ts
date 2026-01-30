import { useState, forwardRef } from 'react'
import type { RenderAdapter, BoxProps, TextProps, PressableProps, TextInputProps, ScrollBoxProps } from '../types'

const Box = forwardRef<HTMLDivElement, BoxProps>(({ style, children, onPress, testID }, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      onClick={onPress}
      data-testid={testID}
    >
      {children}
    </div>
  )
})
Box.displayName = 'Box'

const Text = forwardRef<HTMLSpanElement, TextProps>(({ style, children, numberOfLines, testID }, ref) => {
  const textStyle = numberOfLines ? {
    ...style,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    display: '-webkit-box' as const,
    WebkitLineClamp: numberOfLines,
    WebkitBoxOrient: 'vertical' as const,
  } : style

  return (
    <span ref={ref} style={textStyle} data-testid={testID}>
      {children}
    </span>
  )
})
Text.displayName = 'Text'

const Pressable = forwardRef<HTMLButtonElement, PressableProps>(({
  style,
  children,
  onPress,
  onHoverIn,
  onHoverOut,
  disabled,
  testID,
}, ref) => {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const computedStyle = typeof style === 'function' ? style({ pressed, hovered }) : style
  const computedChildren = typeof children === 'function' ? children({ pressed, hovered }) : children

  return (
    <button
      ref={ref}
      type="button"
      style={{
        ...computedStyle,
        border: computedStyle?.border ?? 'none',
        background: computedStyle?.background ?? computedStyle?.backgroundColor ?? 'transparent',
      }}
      onClick={onPress}
      onMouseEnter={() => {
        setHovered(true)
        onHoverIn?.()
      }}
      onMouseLeave={() => {
        setHovered(false)
        onHoverOut?.()
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      disabled={disabled}
      data-testid={testID}
    >
      {computedChildren}
    </button>
  )
})
Pressable.displayName = 'Pressable'

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  style,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  editable = true,
  keyboardType,
  testID,
}, ref) => {
  const inputType = keyboardType === 'numeric' ? 'number' : keyboardType === 'email-address' ? 'email' : 'text'

  return (
    <input
      ref={ref}
      type={inputType}
      style={{
        ...style,
        '::placeholder': { color: placeholderTextColor },
      } as React.CSSProperties}
      value={value}
      onChange={(e) => onChangeText?.(e.target.value)}
      placeholder={placeholder}
      disabled={!editable}
      data-testid={testID}
    />
  )
})
TextInput.displayName = 'TextInput'

const ScrollBox = forwardRef<HTMLDivElement, ScrollBoxProps>(({
  style,
  contentContainerStyle,
  children,
  testID,
}, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        overflow: 'auto',
      }}
      data-testid={testID}
    >
      <div style={contentContainerStyle}>
        {children}
      </div>
    </div>
  )
})
ScrollBox.displayName = 'ScrollBox'

export const webRenderAdapter: RenderAdapter = {
  Box: Box as React.ComponentType<BoxProps>,
  Text: Text as React.ComponentType<TextProps>,
  Pressable: Pressable as React.ComponentType<PressableProps>,
  TextInput: TextInput as React.ComponentType<TextInputProps>,
  ScrollBox: ScrollBox as React.ComponentType<ScrollBoxProps>,
}
