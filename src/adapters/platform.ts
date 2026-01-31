// Platform detection - works on both web and React Native
export type Platform = 'web' | 'native'

export const detectPlatform = (): Platform => {
  // React Native sets this global
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return 'native'
  }
  return 'web'
}

export const isWeb = () => detectPlatform() === 'web'
export const isNative = () => detectPlatform() === 'native'

// Re-export for convenience
export const Platform = {
  detect: detectPlatform,
  isWeb,
  isNative,
  select: <T>(options: { web: T; native: T }): T =>
    isWeb() ? options.web : options.native,
}
