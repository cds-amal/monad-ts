import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdapterProvider } from './adapters'
import { webAdapter } from './adapters/web'
import './index.css'
import './fonts.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdapterProvider adapter={webAdapter}>
      <App />
    </AdapterProvider>
  </StrictMode>,
)
