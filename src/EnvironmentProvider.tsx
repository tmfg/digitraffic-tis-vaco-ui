import {
  AccountInfo,
  EventMessage,
  EventType,
  IPublicClientApplication,
  PublicClientApplication
} from '@azure/msal-browser'
import { msalConfig } from './authConfig'
import { MsalProvider } from '@azure/msal-react'
import { initializeHttpClient } from './HttpClient.ts'
import { Bootstrap } from './types/Bootstrap'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { initI18n } from './i18n'

const BOOTSTRAP_PATH = '/api/ui/bootstrap'

const fetchBootstrap = async (url: string): Promise<Bootstrap> => {
  try {
    return (await axios.get(url)).data as Bootstrap
  } catch (e) {
    console.warn('Rejecting unparseable json ', e)
    return Promise.reject(e)
  }
}

const getBootstrap = async (): Promise<Bootstrap> => {
  return fetchBootstrap(BOOTSTRAP_PATH).catch(async (pl) => {
    console.log('Primary URL not available, calling secondary hardcoded URL (' + pl + ')')
    return fetchBootstrap('http://localhost:8080' + BOOTSTRAP_PATH)
  })
}

type Props = {
  children: React.ReactNode
}

const EnvironmentProvider = ({ children }: Props) => {
  const [msalInstance, setMsalInstance] = useState<IPublicClientApplication>()

  const initializeMsal = async (data: Bootstrap) => {
    const pca: IPublicClientApplication = await PublicClientApplication.createPublicClientApplication(msalConfig(data))
    pca.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const account: AccountInfo = event.payload as AccountInfo
        if (account) {
          pca.setActiveAccount(account)
        }
      }
    })
    setMsalInstance(pca)
  }

  useEffect(() => {
    if (!msalInstance) {
      getBootstrap()
        .then((data: Bootstrap) => {
          initializeHttpClient(data)
          initializeMsal(data).then(
            () => {},
            (error) => console.error('Error while initializing PublicClientApplication', error)
          )
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [msalInstance])

  useEffect(() => {
    initI18n().catch((err) => console.error('Failed to initialize i18n', err))
  }, [])

  return <>{msalInstance && <MsalProvider instance={msalInstance}>{children}</MsalProvider>}</>
}

export default EnvironmentProvider
