import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useOptionalAccessToken } from '../../../hooks/optionalAccessToken'
import { getHeaders, HttpClient } from '../../../HttpClient'
import DataDeliveryView from '../../../components/DataDelivery/DataDeliveryView'
import { FdsButtonVariant } from '../../../../coreui-components/src/fds-button'
import { FdsButtonComponent } from '../../../components/fds/FdsButtonComponent'
import { FdsTokenSize2 } from '../../../../coreui-css/lib'
import { downloadFile } from '../../../util/download'
import { getCurrentTimestamp } from '../../../util/date'
import { AxiosResponse } from 'axios'
import { useDataDeliveryFetch } from './hooks'
import LoadSpinner from '../../../components/Common/LoadSpinner/LoadSpinner'
import { AppContext } from '../../../AppContextProvider'
import { rolesContainVacoAdmin } from '../../../util/role'

const DataDeliveryPage = () => {
  const { t, i18n } = useTranslation()
  const appContext = useContext(AppContext)
  const isAdmin = !!appContext.roles && rolesContainVacoAdmin(appContext.roles)
  const [accessToken, ready] = useOptionalAccessToken()
  const [data, isFetchInProgress] = useDataDeliveryFetch(accessToken, ready)

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

  const exportCsv = () => {
    if (!ready) {
      return
    }
    HttpClient.get('/api/ui/admin/data-delivery/export?language=' + (i18n.resolvedLanguage || i18n.language), {
      ...getHeaders(accessToken),
      responseType: 'blob'
    })
      .then(handleDownloadedCsv)
      .catch((error) => console.error('CSV export error', error))
  }

  return (
    <div className={'page-content'}>
      <div style={{ display: 'flex', marginBottom: 0, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>{t('admin:dataDelivery:header')}</h1>
        {isAdmin && (
          <FdsButtonComponent
            onClick={exportCsv}
            disabled={!ready}
            slot="separated"
            icon="download"
            iconSize={FdsTokenSize2}
            variant={FdsButtonVariant.secondary}
            label={'Export CSV'}
          />
        )}
      </div>
      {isFetchInProgress && <LoadSpinner />}
      <DataDeliveryView data={data} />
    </div>
  )
}

export default DataDeliveryPage
