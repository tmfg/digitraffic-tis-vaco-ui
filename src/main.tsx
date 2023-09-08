import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { AccountInfo, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'

// instantiation and initialization
const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig)

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
msalInstance.addEventCallback((event: EventMessage) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const account: AccountInfo = event.payload as AccountInfo
    if (account) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      msalInstance.setActiveAccount(account)
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
)
