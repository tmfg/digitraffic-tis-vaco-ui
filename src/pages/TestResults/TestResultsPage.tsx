import { useTranslation } from 'react-i18next'
import { useOptionalAccessToken } from '../../hooks/optionalAccessToken'
import DataDeliveryView from '../../components/DataDelivery/DataDeliveryView'
import LoadSpinner from '../../components/Common/LoadSpinner/LoadSpinner'
import { useDataDeliveryFetch } from '../AdminTools/DataDelivery/hooks'

const TEST_RESULTS_PATH = '/api/ui/data-delivery/test-results'

const TestResultsPage = () => {
  const { t } = useTranslation()
  const [accessToken, ready] = useOptionalAccessToken()
  const [data, isFetchInProgress] = useDataDeliveryFetch(accessToken, ready, TEST_RESULTS_PATH)

  return (
    <div className={'page-content'}>
      <h1>{t('vaco:testResults')}</h1>
      {isFetchInProgress && <LoadSpinner />}
      <DataDeliveryView data={data} showSearch={false} />
    </div>
  )
}

export default TestResultsPage
