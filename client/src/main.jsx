import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import App from './App.jsx'
import { store } from './app/store.js'
import { getMe } from './features/auth/authSlice.js'
import './index.css'

// Restore the logged-in session on app load
store.dispatch(getMe())

// Auto-logout when the API reports an expired/invalid session
window.addEventListener('auth:logout', () => {
  store.dispatch({ type: 'auth/logout/fulfilled' })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <ToastContainer position="top-right" autoClose={3000} theme="light" />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)