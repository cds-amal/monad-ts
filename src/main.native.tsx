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
import { SafeAreaView, StatusBar, Platform } from 'react-native'
import { AdapterProvider } from './adapters/AdapterContext'
import { nativeAdapter } from './adapters/native'
import { lightTheme, darkTheme } from './adapters/tokens.native'
import { ThemeProvider, useTheme } from './theme/useTheme'
import { EnvironmentProvider, createEnvironment } from './environment'
import { FeatureFlagsProvider } from './features'
import { ServicesProvider } from './services/ServicesContext'
import { defaultServices } from './services/defaultServices'
import { UIConfigProvider, ConfigDialog } from './config'
import App from './App'

const environment = createEnvironment(
  __DEV__ ? 'development' : 'production',
  Platform.OS === 'ios' ? 'ios' : 'android'
)

function ThemedApp() {
  const { isDark } = useTheme()
  const tokens = isDark ? darkTheme : lightTheme

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background.alternative }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <FeatureFlagsProvider>
        <ServicesProvider services={defaultServices}>
          <AdapterProvider adapter={nativeAdapter}>
            <UIConfigProvider>
              <App />
              <ConfigDialog />
            </UIConfigProvider>
          </AdapterProvider>
        </ServicesProvider>
      </FeatureFlagsProvider>
    </SafeAreaView>
  )
}

function NativeApp() {
  return (
    <EnvironmentProvider environment={environment}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </EnvironmentProvider>
  )
}

registerRootComponent(NativeApp)
