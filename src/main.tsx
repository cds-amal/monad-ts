import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdapterProvider } from './adapters'
import { webAdapter } from './adapters/web'
import { EnvironmentProvider, createEnvironment } from './environment'
import { ThemeProvider } from './theme/useTheme'
import { FeatureFlagsProvider } from './features'
import { ServicesProvider } from './services/ServicesContext'
import { defaultServices } from './services/defaultServices'
import './index.css'
import './fonts.css'
import App from './App'

const environment = createEnvironment(
  import.meta.env.DEV ? 'development' : 'production',
  'web'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EnvironmentProvider environment={environment}>
      <ThemeProvider>
        <FeatureFlagsProvider>
          <ServicesProvider services={defaultServices}>
            <AdapterProvider adapter={webAdapter}>
              <App />
            </AdapterProvider>
          </ServicesProvider>
        </FeatureFlagsProvider>
      </ThemeProvider>
    </EnvironmentProvider>
  </StrictMode>,
)
