import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { CompanyEntriesPage, Resource } from '../../../types/EntryResource'

export const useCompanyEntriesFetch = (accessToken: string | null, businessId: string | undefined) => {
  const [entryData, setEntryData] = useState<Resource<CompanyEntriesPage> | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore && businessId) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/pages/admin-company-entries/' + businessId, getHeaders(accessToken)).then(
        (response) => {
          const entries = response.data as Resource<CompanyEntriesPage>
          setEntryData(entries)
          setIsFetchInProgress(false)
        },
        (error) => {
          // TODO: show alert
          setIsFetchInProgress(false)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken, businessId])

  return [entryData, isFetchInProgress] as const
}
