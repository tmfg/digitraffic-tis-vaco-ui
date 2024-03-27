import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { CompanyLatestEntryResource } from '../../../types/DataDelivery'

export const useDataDeliveryFetch = (accessToken: string | null) => {
  const [data, setData] = useState<CompanyLatestEntryResource[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/admin/data-delivery', getHeaders(accessToken)).then(
        (response) => {
          setData(response.data as CompanyLatestEntryResource[])
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
  }, [accessToken])

  return [data, isFetchInProgress] as const
}
