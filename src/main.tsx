import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './design-system/global.css'
import './index.css'
import App from './App.tsx'

// Build version: 2024-11-23-ACURA-TLX-FIX - Force cache refresh
console.log('App version: 2024-11-23-ACURA-TLX-FIX');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
