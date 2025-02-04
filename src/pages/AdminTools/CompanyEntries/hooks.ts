import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { CompanyEntriesPage, EntryResource, Resource, RuleInput } from '../../../types/EntryResource'
import { EntryRequest } from '../../../components/TestData/types.ts'

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

export const postRerunEntry = (entry: EntryResource | undefined, accessToken: string | null, setIsModalOpen: (status: boolean) => void, setEntryResource: (entry: EntryResource) => void) => {

  const validations : RuleInput[] | undefined = entry?.data.validations
  const conversions: RuleInput[] | undefined = entry?.data.conversions

  const requestBody: EntryRequest = {
    name: entry?.data.name as string,
    businessId: entry?.data.businessId as string,
    credentials: entry?.data.credentials as string,
    url: entry?.data.url as string,
    context: entry?.data.context as string,
    etag: entry?.data.etag as string,
    format: (entry?.data.format as string).toLowerCase(),
    validations,
    conversions,
    sendNotifications: entry?.data.sendNotifications as boolean
  }

  if(accessToken) {
    HttpClient.post('/api/ui/queue', requestBody, getHeaders(accessToken)).then(
      (response) => {
        const data = response.data as EntryResource
        setEntryResource(data)
      }
    )
    setIsModalOpen(true)
  }

}


