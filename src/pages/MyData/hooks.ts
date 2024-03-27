import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { EntryResource } from '../../types/EntryResource'

export const useMyDataEntriesFetch = (accessToken: string | null) => {
  const [entryData, setEntryData] = useState<EntryResource[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/entries?full=false', getHeaders(accessToken)).then(
        (response) => {
          const entries = response.data as EntryResource[]
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
  }, [accessToken])

  return [entryData, isFetchInProgress] as const
}
