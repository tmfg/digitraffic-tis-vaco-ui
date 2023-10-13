import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { AccountInfo, EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'
import { initializeHttpClient } from "./HttpClient.ts";

import axios from 'axios'
import { Bootstrap } from './types/Bootstrap'

async function callBootstrap(url: string): Promise<Bootstrap> {
  try {
    return (await axios.get(url)).data
  } catch (e) {
    console.warn('rejecting unparseable json ' + e)
    return Promise.reject(e)
  }
}

async function get_bootstrap(): Promise<Bootstrap> {
  return callBootstrap('/api/ui/bootstrap').catch(async (pl) => {
    console.log("primary URL not available, calling secondary hardcoded URL (" + pl + ")")
    return callBootstrap('http://localhost:8080/api/ui/bootstrap')
  })
}

let bootstrap: Bootstrap = await get_bootstrap();
initializeHttpClient(bootstrap)

const msalInstance: PublicClientApplication = new PublicClientApplication(msalConfig(bootstrap))

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    const account: AccountInfo = event.payload as AccountInfo
    if (account) {
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
