import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './store/store.js'
import "./api/axiosSetup";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store/store.js'
async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return
  }
  const { worker } = await import("./mocks/browser.js")
  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </StrictMode>,
  )
})