import React from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { AppProviders } from './Providers'
import App from './App'

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
)