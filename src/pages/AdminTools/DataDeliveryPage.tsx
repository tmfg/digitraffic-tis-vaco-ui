import { useTranslation } from 'react-i18next'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { CompanyLatestEntryResource } from '../../types/DataDelivery'
import { AppContext, AppContextType } from '../../AppContextProvider'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import AdminRoleRequiredPage from '../Error/AdminRoleRequiredPage'
import DataDeliveryView from '../../components/DataDelivery/DataDeliveryView'
import { useContext, useEffect, useState } from 'react'

const DataDeliveryPage = () => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)
  const [data, setData] = useState<CompanyLatestEntryResource[] | null>(null)

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
  }, [appContext])

  useEffect(() => {
    let ignore = false

    if (inProgress === InteractionStatus.None && isAuthenticated && !ignore && !accessToken) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }
          setAccessToken(tokenResult.accessToken)
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [instance, inProgress, accessToken, isAuthenticated])

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      HttpClient.get('/api/ui/admin/data-delivery', getHeaders(accessToken)).then(
        (response) => {
          setData(response.data as CompanyLatestEntryResource[])
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken])

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h1>{t('admin:dataDelivery:header')}</h1>
        {(hasAdminRole || hasCompanyAdminRole) && <DataDeliveryView data={data} />}
        {hasAdminRole !== undefined && hasCompanyAdminRole !== undefined && !(hasAdminRole || hasCompanyAdminRole) && (
          <AdminRoleRequiredPage />
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default DataDeliveryPage
