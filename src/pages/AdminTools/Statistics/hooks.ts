import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { StatusStatistics } from '../../../types/Statistics.ts'

export const taskStatusConfig = {
  header: "admin:statistics:tasksStatusHeader",
  allNames: ["gtfs.canonical", "netex.entur", "netex2gtfs.entur", "gtfs2netex.fintraffic", "gbfs.entur"],
  statusColors: {
    'gtfs.canonical': "#001C5B",
    'netex.entur': "#0034AC",
    'gtfs2netex.fintraffic': "#1777F8",
    'netex2gtfs.entur': "#90CEFE",
    'gbfs.entur': "#EFF8FF",
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
    'gtfs': "#EEC200",
    'netex': "#B47324",
    'gbfs': "#FFFADB"
  }
}

export const useStatisticsFetch = (accessToken: string | null) => {
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)
  const [entryStatusStats, setEntryStatusStats] = useState<StatusStatistics[] | null>(null)
  const [taskStatusStats, setTaskStatusStats] = useState<StatusStatistics[] | null>(null)

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/entry-statistics', getHeaders(accessToken)).then(
        (response) => {
          setEntryStatusStats(response.data.data)
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
          setTaskStatusStats(response.data.data)
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
