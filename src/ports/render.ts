/**
 * RenderPort - Interface for rendering components.
 * Abstracts the rendering target (DOM, React Native, etc.)
 */

import { ReactNode } from 'react'

// Layout direction
export type Direction = 'row' | 'column'
export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'between'

// Base props that all render elements support
export interface BaseRenderProps<TStyle> {
  styles?: TStyle | TStyle[]
  children?: ReactNode
  testId?: string
}

// Box props - the fundamental container
export interface BoxProps<TStyle> extends BaseRenderProps<TStyle> {
  as?: string
  onClick?: () => void
  onMouseEnter?: (e: unknown) => void
  onMouseLeave?: (e: unknown) => void
}

// Stack props - linear layouts
export interface StackProps<TStyle> extends BaseRenderProps<TStyle> {
  gap?: number
  direction?: Direction
  align?: Alignment
  justify?: Alignment
}

// Text props
export interface TextProps<TStyle> extends BaseRenderProps<TStyle> {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'label'
}

// Input props
export interface InputProps<TStyle> extends BaseRenderProps<TStyle> {
  type?: 'text' | 'number' | 'password'
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

// Button props
export interface ButtonProps<TStyle> extends BaseRenderProps<TStyle> {
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

// RenderPort interface - what adapters must implement
export interface RenderPort<TStyle> {
  Box(props: BoxProps<TStyle>): ReactNode
  VStack(props: StackProps<TStyle>): ReactNode
  HStack(props: StackProps<TStyle>): ReactNode
  Flex(props: StackProps<TStyle>): ReactNode
  Text(props: TextProps<TStyle>): ReactNode
  Input(props: InputProps<TStyle>): ReactNode
  Button(props: ButtonProps<TStyle>): ReactNode
  Divider(props: BaseRenderProps<TStyle>): ReactNode
}
