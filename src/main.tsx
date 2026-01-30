import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdapterProvider } from './context/AdapterContext'
import { webAdapter } from './adapters/web'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdapterProvider adapter={webAdapter}>
      <App />
    </AdapterProvider>
  </StrictMode>,
)
