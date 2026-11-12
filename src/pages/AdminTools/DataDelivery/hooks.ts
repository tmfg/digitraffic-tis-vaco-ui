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
          console.error('Data delivery fetch error', error)
          setIsFetchInProgress(false)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken, ready])

  return [data, isFetchInProgress] as const
}
