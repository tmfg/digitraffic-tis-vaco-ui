import { AuthenticationResult, InteractionRequiredAuthError, IPublicClientApplication } from '@azure/msal-browser'
import { loginRequest } from '../authConfig'

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
