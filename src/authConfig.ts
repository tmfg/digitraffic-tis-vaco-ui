import { AccountInfo, Configuration, RedirectRequest } from '@azure/msal-browser'
import { Bootstrap, Environment } from './types/Bootstrap.ts'

/* istanbul ignore next 75 -- @preserve */

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = (bootstrap: Bootstrap): Configuration => {
  const baseUrl =
    bootstrap.environment === Environment.Local
      ? 'http://localhost:5173' + import.meta.env.BASE_URL
      : bootstrap.baseUrl + import.meta.env.BASE_URL + '/'
  return {
    auth: {
      clientId: bootstrap.clientId,
      authority: 'https://login.microsoftonline.com/' + bootstrap.tenantId,
      redirectUri: baseUrl,
      postLogoutRedirectUri: baseUrl,
      navigateToLoginRequestUrl: true
      //knownAuthorities: [],
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
    }
    // Leaving this for future inspiration:
    /*system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message)
              return
            case LogLevel.Info:
              console.info(message)
              return
            case LogLevel.Verbose:
              console.debug(message)
              return
            case LogLevel.Warning:
              console.warn(message)
              return
            default:
              return
          }
        }
      }
    }*/
  }
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = (clientId: string): RedirectRequest => {
  return {
    scopes: [`api://${clientId}/VACO.App`],
    prompt: 'select_account'
  }
}

export const tokenRequest = (account: AccountInfo, clientId: string): RedirectRequest => {
  return {
    scopes: [`api://${clientId}/VACO.App`],
    account
  }
}

export const createAccountRequest = (clientId: string): RedirectRequest => {
  return {
    scopes: [`api://${clientId}/VACO.App`],
    prompt: 'create'
  }
}

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
}
