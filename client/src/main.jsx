import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PWAInstall } from './components/PWAInstall.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PWAInstall />
    <App />
  </StrictMode>,
)
