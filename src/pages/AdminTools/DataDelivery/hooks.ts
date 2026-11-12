import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { CompanyLatestEntryResource } from '../../../types/DataDelivery'

export const useDataDeliveryFetch = (accessToken: string | null, ready: boolean) => {
  const [data, setData] = useState<CompanyLatestEntryResource[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (ready) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/data-delivery', getHeaders(accessToken)).then(
        (response) => {
          if (!ignore) {
            setData(response.data as CompanyLatestEntryResource[])
            setIsFetchInProgress(false)
          }
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
  }, [accessToken, ready])

  return [data, isFetchInProgress] as const
}
