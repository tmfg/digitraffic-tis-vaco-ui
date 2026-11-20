import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { useAcquireToken } from './auth'

/**
 * Token for pages that are open to everyone. A signed-in user may see more than a visitor, so the page waits for the
 * token of a signed-in user. A visitor never has a token, so the page does not wait for one.
 *
 * @returns the token (null for a visitor) and whether the page may fetch now
 */
export const useOptionalAccessToken = () => {
  const { inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken] = useAcquireToken()
  const ready = inProgress === InteractionStatus.None && (!isAuthenticated || accessToken !== null)
  return [accessToken, ready] as const
}
