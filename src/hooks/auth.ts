import {
  AuthenticationResult,
  InteractionRequiredAuthError,
  InteractionStatus,
  IPublicClientApplication
} from '@azure/msal-browser'
import { createAccountRequest, loginRequest } from '../authConfig'

export const acquireToken = (msalInstance: IPublicClientApplication): Promise<AuthenticationResult | void> => {
  return msalInstance
    .acquireTokenSilent(loginRequest)
    .then((tokenResponse) => {
      return tokenResponse
    })
    .catch((error) => {
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenRedirect(loginRequest)
      }
    })
}

export const login = (msalInstance: IPublicClientApplication) => {
  msalInstance.loginRedirect(loginRequest).catch((error) => {
    console.log(error)
  })
}

export const createAccount = (msalInstance: IPublicClientApplication) => {
  msalInstance.loginRedirect(createAccountRequest).catch((error) => {
    console.log(error)
  })
}

export const logout = (msalInstance: IPublicClientApplication) => {
  const activeAccount = msalInstance.getActiveAccount()
  if (activeAccount) {
    const logoutRequest = {
      account: msalInstance.getAccountByHomeId(activeAccount.homeAccountId),
      postLogoutRedirectUri: import.meta.env.PROD
        ? 'https://digitraffic-tis-dev.aws.fintraffic.cloud/ui/'
        : 'http://localhost:5173' + import.meta.env.BASE_URL
    }
    msalInstance.logoutRedirect(logoutRequest).catch((error) => {
      console.log(error)
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
