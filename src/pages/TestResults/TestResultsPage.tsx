import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../../AppContextProvider'
import { getHeaders, HttpClient } from '../../HttpClient'
import { useOptionalAccessToken } from '../../hooks/optionalAccessToken'
import LoadSpinner from '../../components/Common/LoadSpinner/LoadSpinner'
import EntriesSearchTable from '../AdminTools/CompanyEntries/EntriesSearchTable'
import { EntryResource, EntrySummary } from '../../types/EntryResource'
import { PublicValidationTest } from '../../types/PublicValidationTest'

const useOwnEntriesFetch = (accessToken: string) => {
  const [entries, setEntries] = useState<EntrySummary[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    setIsFetchInProgress(true)
    HttpClient.get('/api/ui/entries?full=false', getHeaders(accessToken))
      .then((response) => {
        if (!ignore) {
          setEntries((response.data as EntryResource[]).map((resource) => resource.data))
        }
      })
      .catch(() => {
        if (!ignore) {
          setEntries(null)
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsFetchInProgress(false)
        }
      })
    return () => {
      ignore = true
    }
  }, [accessToken])

  return [entries, isFetchInProgress] as const
}

/** The latest entries of the companies of the logged-in user, with the search form. */
const OwnEntriesView = ({ accessToken }: { accessToken: string }) => {
  const { t } = useTranslation()
  const [entries, isFetchInProgress] = useOwnEntriesFetch(accessToken)

  return (
    <div className={'page-content'}>
      <h1>{t('services:myData:header')}</h1>
      <div className={'page-intro'}>{t('services:myData:intro')}</div>
      <EntriesSearchTable entries={entries} isFetchInProgress={isFetchInProgress} showSearch={true} />
    </div>
  )
}

/**
 * The "Test and validation results" page. A user with companies sees the latest entries of all the companies. A visitor
 * and a user without a company of their own get the public validation test company.
 */
const TestResultsPage = () => {
  const [accessToken, ready] = useOptionalAccessToken()
  const { companies } = useContext(AppContext)

  const waitingForCompanies = accessToken !== null && companies === undefined
  if (!ready || waitingForCompanies) {
    return <LoadSpinner />
  }

  const hasOwnCompany = (companies ?? []).some((company) => company.businessId !== PublicValidationTest.businessId)
  if (accessToken === null || !hasOwnCompany) {
    return <Navigate to={'/data/companies/' + PublicValidationTest.businessId} replace />
  }
  return <OwnEntriesView accessToken={accessToken} />
}

export default TestResultsPage
