import { IPublicClientApplication } from '@azure/msal-browser'

export type MsalMethod = (msalInstance: IPublicClientApplication) => void
