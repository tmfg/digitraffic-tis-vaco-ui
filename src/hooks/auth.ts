import {
  AccountInfo,
  AuthenticationResult,
  BrowserAuthError,
  InteractionRequiredAuthError,
  InteractionStatus,
  IPublicClientApplication
} from '@azure/msal-browser'
import { createAccountRequest, loginRequest, tokenRequest } from '../authConfig'
import { Bootstrap } from '../types/Bootstrap'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'

let bootstrap: Bootstrap
export function initializeBootstrap(b: Bootstrap) {
  bootstrap = b
}

/* istanbul ignore next 56 -- @preserve */
export const acquireToken = (
  msalInstance: IPublicClientApplication,
  inProgress: InteractionStatus
): Promise<AuthenticationResult | void> => {
  const account: AccountInfo | null = msalInstance.getActiveAccount()
  if (!account) {
    // Here could have been an attempt to login,
    // but that (supposedly) should be handled but the <AuthenticatedTemplate> instead
    return Promise.resolve()
  }
  return msalInstance
    .acquireTokenSilent(tokenRequest(account, bootstrap.clientId))
    .then((tokenResponse) => {
      return tokenResponse
    })
    .catch((error) => {
      console.error('Acquiring token failed ', isUserInTransition(inProgress), error, msalInstance.getActiveAccount())
      if (
        (error instanceof InteractionRequiredAuthError || error instanceof BrowserAuthError) &&
        !isUserInTransition(inProgress)
      ) {
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenRedirect(loginRequest(bootstrap.clientId))
      }
    })
}

/* istanbul ignore next 56 -- @preserve */
export const login = (msalInstance: IPublicClientApplication) => {
  return msalInstance.loginRedirect(loginRequest(bootstrap.clientId))
}

/* istanbul ignore next 56 -- @preserve */
export const createAccount = (msalInstance: IPublicClientApplication) => {
  msalInstance.loginRedirect(createAccountRequest(bootstrap.clientId)).catch((error) => {
    console.error('Account creation error', error)
  })
}

/* istanbul ignore next 56 -- @preserve */
export const logout = (msalInstance: IPublicClientApplication) => {
  const activeAccount = msalInstance.getActiveAccount()
  if (activeAccount) {
    const logoutRequest = {
      account: msalInstance.getAccountByHomeId(activeAccount.homeAccountId)
    }
    msalInstance.logoutRedirect(logoutRequest).catch((error) => {
      console.error(error)
    })
  }
}

export const isUserInTransition = (status: InteractionStatus) => {
  return (
    status === InteractionStatus.Login ||
    status === InteractionStatus.Logout ||
    status == InteractionStatus.HandleRedirect
  )
}

export const useAcquireToken = () => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (inProgress === InteractionStatus.None && isAuthenticated && !accessToken) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }
          setAccessToken(tokenResult.accessToken)
        },
        (error) => {
          // TODO: Once useEffectEvent hook is released in a stable version of React, let's use it and make error handler components-specific
          return Promise.reject(error)
        }
      )
    }
  }, [accessToken, inProgress, instance, isAuthenticated])

  return [accessToken]
}
