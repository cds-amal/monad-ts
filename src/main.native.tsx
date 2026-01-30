import { registerRootComponent } from 'expo'
import { AdapterProvider } from './context/AdapterContext'
import { nativeAdapter } from './adapters/native'
import App from './App'

function NativeApp() {
  return (
    <AdapterProvider adapter={nativeAdapter}>
      <App />
    </AdapterProvider>
  )
}

registerRootComponent(NativeApp)
