import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { CompanyLatestEntryResource } from '../../../types/DataDelivery'

export const useDataDeliveryFetch = (
  accessToken: string | null,
  ready: boolean,
  path: string = '/api/ui/data-delivery'
) => {
  const [data, setData] = useState<CompanyLatestEntryResource[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (ready) {
      setIsFetchInProgress(true)
      HttpClient.get(path, getHeaders(accessToken))
        .then((response) => {
          if (!ignore) {
            setData(response.data as CompanyLatestEntryResource[])
            setIsFetchInProgress(false)
          }
        })
        .catch((error) => {
          console.error('Data delivery fetch error', error)
          setIsFetchInProgress(false)
        })
    }
    return () => {
      ignore = true
    }
  }, [accessToken, ready, path])

  return [data, isFetchInProgress] as const
}
