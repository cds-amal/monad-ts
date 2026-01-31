// Native adapter exports - avoids bundling web dependencies
export { Platform, detectPlatform, isWeb, isNative } from './platform'
export { AdapterProvider, useAdapter, usePrimitives, useThemeAdapter } from './AdapterContext.native'
export { nativeAdapter } from './native'
export type { UIAdapter, BoxProps, TextProps, PressableProps, TextInputProps, ScrollViewProps, ButtonProps, IconButtonProps } from './types'
