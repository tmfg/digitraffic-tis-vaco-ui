import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { CompanyEntriesPage, EntryResource, Resource } from '../../../types/EntryResource'

export const useCompanyEntriesFetch = (accessToken: string | null, ready: boolean, businessId: string | undefined) => {
  const [entryData, setEntryData] = useState<Resource<CompanyEntriesPage> | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (ready && businessId) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/pages/company-entries/' + businessId, getHeaders(accessToken))
        .then((response) => {
          if (!ignore) {
            const entries = response.data as Resource<CompanyEntriesPage>
            setEntryData(entries)
            setIsFetchInProgress(false)
          }
        })
        .catch((error) => {
          console.error('Company entries fetch error', error)
          setIsFetchInProgress(false)
        })
    }
    return () => {
      ignore = true
    }
  }, [accessToken, ready, businessId])

  return [entryData, isFetchInProgress] as const
}

export const postRerunEntry = (publicId: string, accessToken: string | null, setIsModalOpen: (status: boolean) => void, setEntryResource: (entry: EntryResource) => void) => {
  if (accessToken) {
    HttpClient.post('/api/ui/admin/entries/' + publicId + '/rerun', undefined, getHeaders(accessToken))
      .then((response) => {
        const data = response.data as EntryResource
        setEntryResource(data)
      })
      .catch(() => {
        setIsModalOpen(false)
      })
    setIsModalOpen(true)
  }
}


