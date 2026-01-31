/**
 * React Native Entry Point
 *
 * IMPORTANT: Polyfills must be imported FIRST before any other imports.
 */

// Polyfills - must be first!
import '../shims/globals';
import 'react-native-get-random-values';

// Ensure globalThis.crypto is set (some RN/Hermes combos need this)
if (global.crypto && !globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = global.crypto;
}

import { registerRootComponent } from 'expo'
import { SafeAreaView, StatusBar } from 'react-native'
import { AdapterProvider } from './adapters/AdapterContext'
import { nativeAdapter } from './adapters/native'
import { ThemeProvider, useTheme } from './theme/useTheme'
import App from './App'

function AppWithSafeArea() {
  const { isDark } = useTheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121314' : '#f3f5f9' }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AdapterProvider adapter={nativeAdapter}>
        <App />
      </AdapterProvider>
    </SafeAreaView>
  )
}

function NativeApp() {
  return (
    <ThemeProvider>
      <AppWithSafeArea />
    </ThemeProvider>
  )
}

registerRootComponent(NativeApp)
