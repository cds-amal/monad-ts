import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdapterProvider } from './adapters'
import { webAdapter } from './adapters/web'
import { ServicesProvider } from './services/ServicesContext'
import { defaultServices } from './services/defaultServices'
import './index.css'
import './fonts.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServicesProvider services={defaultServices}>
      <AdapterProvider adapter={webAdapter}>
        <App />
      </AdapterProvider>
    </ServicesProvider>
  </StrictMode>,
)
