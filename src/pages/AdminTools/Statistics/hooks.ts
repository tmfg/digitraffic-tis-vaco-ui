import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { StatResource} from '../../../types/Statistics.ts'

export const taskStatusConfig = {
  header: "admin:statistics:tasksStatusHeader",
  allNames: ["gtfs.canonical", "netex.entur", "netex2gtfs.entur", "gtfs2netex.fintraffic", "gbfs.entur"],
  statusColors: {
    'gtfs.canonical': "#25A794",
    'netex.entur': "#EEC200",
    'netex2gtfs.entur': "#E65636",
    'gtfs2netex.fintraffic': "#1777F8",
    'gbfs.entur': "#9696AA",
  }
}

export const entryStatusConfig = {
  header: "admin:statistics:statusHeader",
  allNames: ["success", "warnings", "errors", "processing", "failed", "cancelled"],
  statusColors: {
    success: "#25A794",
    warnings: "#EEC200",
    errors: "#E65636",
    processing: "#1777F8",
    cancelled: "#9696AA",
    failed: "#B40000",
  }
}

export const InputFormatConfig = {
  header: "admin:statistics:InputFormatStatusHeader",
  allNames: ["gtfs", "netex", "gbfs"],
  statusColors: {
    'gtfs': "#E55636",
    'netex': "#1777F8",
    'gbfs': "#9696AA"
  }
}

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
