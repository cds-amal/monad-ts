/**
 * Browser RenderAdapter - implements RenderPort for React DOM.
 */

import React, { forwardRef, ReactNode } from 'react'
import { BrowserStyle } from './style'
import { spacing } from './tokens'

// Style composition helper
const mergeStyles = (styles?: BrowserStyle | BrowserStyle[]): BrowserStyle => {
  if (!styles) return {}
  if (Array.isArray(styles)) {
    return styles.reduce((acc, s) => ({ ...acc, ...s }), {})
  }
  return styles
}

// Gap values for stacks
const gapValues: Record<number, string> = {
  0: '0', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
  5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
}

// --- Layout Components ---

interface BoxProps {
  as?: keyof JSX.IntrinsicElements
  styles?: BrowserStyle | BrowserStyle[]
  children?: ReactNode
  onClick?: () => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  testId?: string
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Tag = 'div', styles, children, onClick, onMouseEnter, onMouseLeave, testId }, ref) => {
    const Element = Tag as React.ElementType
    return (
      <Element
        ref={ref}
        style={mergeStyles(styles)}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-testid={testId}
      >
        {children}
      </Element>
    )
  }
)
Box.displayName = 'Box'

interface StackProps {
  gap?: number
  styles?: BrowserStyle | BrowserStyle[]
  children?: ReactNode
  testId?: string
}

export const VStack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 4, styles, children, testId }, ref) => {
    const stackStyle: BrowserStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: gapValues[gap] ?? spacing[4],
    }
    return (
      <Box ref={ref} styles={[stackStyle, mergeStyles(styles)]} testId={testId}>
        {children}
      </Box>
    )
  }
)
VStack.displayName = 'VStack'

export const HStack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 4, styles, children, testId }, ref) => {
    const stackStyle: BrowserStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: gapValues[gap] ?? spacing[4],
    }
    return (
      <Box ref={ref} styles={[stackStyle, mergeStyles(styles)]} testId={testId}>
        {children}
      </Box>
    )
  }
)
HStack.displayName = 'HStack'

interface FlexProps extends StackProps {
  as?: keyof JSX.IntrinsicElements
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'between'
  justify?: 'start' | 'center' | 'end' | 'stretch' | 'between'
  wrap?: boolean
  onClick?: () => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  between: 'space-between',
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ as, direction = 'row', align, justify, wrap, gap, styles, children, testId, onClick, onMouseEnter, onMouseLeave }, ref) => {
    const flexStyle: BrowserStyle = {
      display: 'flex',
      flexDirection: direction,
      alignItems: align ? alignMap[align] : undefined,
      justifyContent: justify ? alignMap[justify] : undefined,
      flexWrap: wrap ? 'wrap' : undefined,
      gap: gap !== undefined ? gapValues[gap] : undefined,
    }
    return (
      <Box
        ref={ref}
        as={as}
        styles={[flexStyle, mergeStyles(styles)]}
        testId={testId}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </Box>
    )
  }
)
Flex.displayName = 'Flex'

export const Spacer: React.FC = () => <div style={{ flex: 1 }} />

interface DividerProps {
  vertical?: boolean
  styles?: BrowserStyle | BrowserStyle[]
}

export const Divider: React.FC<DividerProps> = ({ vertical, styles }) => {
  const dividerStyle: BrowserStyle = {
    backgroundColor: '#e5e7eb',
    ...(vertical
      ? { width: '1px', alignSelf: 'stretch' }
      : { height: '1px', width: '100%' }),
  }
  return <Box styles={[dividerStyle, mergeStyles(styles)]} />
}

export const Center = forwardRef<HTMLDivElement, StackProps>(
  ({ styles, children, testId }, ref) => {
    const centerStyle: BrowserStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
    return (
      <Box ref={ref} styles={[centerStyle, mergeStyles(styles)]} testId={testId}>
        {children}
      </Box>
    )
  }
)
Center.displayName = 'Center'

// --- Form Components ---

interface TextProps {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'label'
  styles?: BrowserStyle | BrowserStyle[]
  children?: ReactNode
}

export const Text: React.FC<TextProps> = ({ as: Tag = 'span', styles, children }) => (
  <Tag style={mergeStyles(styles)}>{children}</Tag>
)

interface InputFieldProps {
  type?: 'text' | 'number' | 'password'
  value?: string
  placeholder?: string
  disabled?: boolean
  styles?: BrowserStyle | BrowserStyle[]
  onChange?: (value: string) => void
}

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  value,
  placeholder,
  disabled,
  styles,
  onChange,
}) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    style={mergeStyles(styles)}
    onChange={e => onChange?.(e.target.value)}
    step={type === 'number' ? 'any' : undefined}
  />
)

interface ButtonElementProps {
  type?: 'button' | 'submit'
  disabled?: boolean
  styles?: BrowserStyle | BrowserStyle[]
  children?: ReactNode
  onClick?: () => void
}

export const ButtonElement: React.FC<ButtonElementProps> = ({
  type = 'button',
  disabled,
  styles,
  children,
  onClick,
}) => (
  <button type={type} disabled={disabled} style={mergeStyles(styles)} onClick={onClick}>
    {children}
  </button>
)
