// Adapter system for cross-platform support
export { Platform, detectPlatform, isWeb, isNative } from './platform'
export { AdapterProvider, useAdapter, usePrimitives, useThemeAdapter } from './AdapterContext'
export { webAdapter } from './web'
export { nativeAdapter } from './native'
export type { UIAdapter, BoxProps, TextProps, PressableProps, TextInputProps, ScrollViewProps } from './types'
