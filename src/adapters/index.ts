// Re-export types
export type {
  Adapter,
  RenderAdapter,
  StyleAdapter,
  Style,
  BoxProps,
  TextProps,
  PressableProps,
  TextInputProps,
  ScrollBoxProps,
} from './types'

// Re-export adapters
export { webAdapter } from './web'
// Note: nativeAdapter is imported dynamically to avoid RN dependency on web
