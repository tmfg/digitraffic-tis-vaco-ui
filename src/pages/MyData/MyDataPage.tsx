import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getHeaders, HttpClient } from '../../HttpClient'
import EntriesSearchTable from '../AdminTools/CompanyEntries/EntriesSearchTable'
import { EntryResource, EntrySummary } from '../../types/EntryResource'

/** Fetches the latest entries of the companies of the logged-in user. Returns the entries and the fetch state. */
const useMyDataEntriesFetch = (accessToken: string) => {
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

/**
 * The "Own data publications" page. Shows the latest entries of the companies of the logged-in user, with the search
 * form. The test results route renders it for a user who has a company of their own.
 */
const MyDataPage = ({ accessToken }: { accessToken: string }) => {
  const { t } = useTranslation()
  const [entries, isFetchInProgress] = useMyDataEntriesFetch(accessToken)

  return (
    <div className={'page-content'}>
      <h1>{t('services:myData:header')}</h1>
      <div className={'page-intro'}>{t('services:myData:intro')}</div>
      <EntriesSearchTable entries={entries} isFetchInProgress={isFetchInProgress} showSearch={true} />
    </div>
  )
}

export default MyDataPage
