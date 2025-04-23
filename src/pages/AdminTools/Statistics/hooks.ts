import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { StatResource} from '../../../types/Statistics.ts'

export const useStatisticsFetch = (accessToken: string | null) => {
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)
  const [entryStatusStats, setEntryStatusStats] = useState<StatResource[] | null>(null)
  const [taskStatusStats, setTaskStatusStats] = useState<StatResource[] | null>(null)

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/entry-statistics', getHeaders(accessToken)).then(
        (response) => {
          setEntryStatusStats(response.data)
          setIsFetchInProgress(false)
        },
        (error) => {
          setIsFetchInProgress(false)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken])


  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/task-statistics', getHeaders(accessToken)).then(
        (response) => {
          setTaskStatusStats(response.data)
          setIsFetchInProgress(false)
        },
        (error) => {
          setIsFetchInProgress(false)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken])

  return [entryStatusStats, taskStatusStats, isFetchInProgress] as const


}
