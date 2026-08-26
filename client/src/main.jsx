import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Self-hosted variable fonts (item: never a blocking Google Fonts <link>)
import '@fontsource-variable/fraunces'
import '@fontsource-variable/schibsted-grotesk'

import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { store } from './app/store.js'
import { getMe } from './features/auth/authSlice.js'
import { clearAuthTokens } from './api/axios.js'
import './index.css'

// Restore the logged-in session on app load
store.dispatch(getMe())

// Auto-logout when the API reports an expired/invalid session
window.addEventListener('auth:logout', () => {
  clearAuthTokens()
  store.dispatch({ type: 'auth/logout/fulfilled' })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* reducedMotion="user" — Framer automatically disables transform
          animations for users with prefers-reduced-motion set (item 10) */}
      <MotionConfig reducedMotion="user">
        <HelmetProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <App />
              <ToastContainer position="top-right" autoClose={3000} theme="light" />
            </BrowserRouter>
          </ErrorBoundary>
        </HelmetProvider>
      </MotionConfig>
    </Provider>
  </StrictMode>,
)