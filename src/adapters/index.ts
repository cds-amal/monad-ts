// Adapter system for cross-platform support
export { Platform, detectPlatform, isWeb, isNative } from './platform'
export { AdapterProvider, useAdapter, usePrimitives, useThemeAdapter } from './AdapterContext'
export { webAdapter } from './web'
// nativeAdapter is imported directly by main.native.tsx to avoid bundling react-native in web builds
export type { UIAdapter, BoxProps, TextProps, PressableProps, TextInputProps, ScrollViewProps, ButtonProps, IconButtonProps } from './types'
