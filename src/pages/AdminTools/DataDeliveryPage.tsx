import { useTranslation } from 'react-i18next'
import { acquireToken, useAcquireToken } from '../../hooks/auth'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { CompanyLatestEntryResource } from '../../types/DataDelivery'
import { AppContext, AppContextType } from '../../AppContextProvider'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import AdminRoleRequiredPage from '../Error/AdminRoleRequiredPage'
import DataDeliveryView from '../../components/DataDelivery/DataDeliveryView'
import { useContext, useEffect, useState } from 'react'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import { downloadFile } from '../../util/download'
import { getCurrentTimestamp } from '../../util/date'
import { AxiosResponse } from 'axios'

const DataDeliveryPage = () => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const [accessToken] = useAcquireToken()
  const appContext: AppContextType = useContext(AppContext)
  const { instance, inProgress } = useMsal()
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

  const handleDownloadedCsv = (response: AxiosResponse<any>) => {
    if (!response?.data) {
      return
    }
    downloadFile(
      response.data as string,
      `${t('admin:dataDelivery:header')} ${getCurrentTimestamp()}.csv`,
      response.data.type
    )
  }

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <div style={{ display: 'flex', marginBottom: 0, alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>{t('admin:dataDelivery:header')}</h1>
          <FdsButtonComponent
            onClick={() => {
              acquireToken(instance, inProgress).then(
                (tokenResult) => {
                  if (!tokenResult) {
                    // TODO: At some point, show some error notification
                    return
                  }
                  HttpClient.get(
                    '/api/ui/admin/data-delivery/export?language=' + (i18n.resolvedLanguage || i18n.language),
                    {
                      ...getHeaders(tokenResult.accessToken),
                      responseType: 'blob'
                    }
                  ).then(
                    (response) => handleDownloadedCsv(response),
                    (error) => {
                      // TODO: show alert
                      return Promise.reject(error)
                    }
                  )
                },
                (error) => {
                  // TODO: show alert
                  return Promise.reject(error)
                }
              )
            }}
            slot="separated"
            icon="download"
            iconSize={FdsTokenSize2}
            variant={FdsButtonVariant.secondary}
            label={'Export CSV'}
          />
        </div>
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
