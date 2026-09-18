import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { store } from './app/store.js'
import { initializeAuth } from './features/auth/authSlice.js'
import { clearAuthTokens } from './api/axios.js'
import './index.css'

// Restore the logged-in session on app load only when a stored session exists.
// This avoids a slow blank page after refresh for public visitors with no token.
store.dispatch(initializeAuth())

// Auto-logout when the API reports an expired/invalid session
window.addEventListener('auth:logout', () => {
  clearAuthTokens()
  store.dispatch({ type: 'auth/logout/fulfilled' })
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
            <ToastContainer position="top-right" autoClose={3000} theme="light" />
          </BrowserRouter>
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)