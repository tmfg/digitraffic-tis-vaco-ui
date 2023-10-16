import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import EnvironmentProvider from './EnvironmentProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnvironmentProvider>
      <App />
    </EnvironmentProvider>
  </React.StrictMode>
)
