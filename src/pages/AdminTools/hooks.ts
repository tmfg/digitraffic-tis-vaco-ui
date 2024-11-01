import { useContext, useEffect, useState } from 'react'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import { AppContext, AppContextType } from '../../AppContextProvider'
import { Subscription } from '../../types/Subscription.ts'
import { getHeaders, HttpClient } from '../../HttpClient.ts'

export const useAdminRightsCheck = () => {
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
  }, [appContext])

  return [hasAdminRole, hasCompanyAdminRole] as const
}

export const useSubscriptionApi = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  const deleteSubscription = (subscription: Subscription, accessToken: string | null): Promise<boolean> => {
    if (accessToken && subscription) {
      return HttpClient.delete('/api/v1/subscriptions/' + subscription.publicId, getHeaders(accessToken)).then(
        (_response) => {
          return true
        },
        (_error) => {
          return false
        }
      )
    } else {
      return Promise.reject(false)
    }
  }

  const reloadSubscriptions = (subscriber: string, accessToken: string | null) => {
    if (accessToken && subscriber) {
      HttpClient.get('/api/v1/subscriptions', {
        params: { subscriber: subscriber },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }).then(
        (response) => {
          console.log('in reload got ' + JSON.stringify(response))
          setSubscriptions(response.data?.data as Subscription[])
        },
        (_error) => {}
      )
    }
  }

  return [subscriptions, reloadSubscriptions, deleteSubscription] as const
}
