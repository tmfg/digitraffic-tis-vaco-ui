import { useEffect, useState } from "react";
import { useAcquireToken } from "./auth.ts";
import { HttpClient } from "../HttpClient.ts";

export const usePageInit = <P, D>(initPath: string,
                                  params: Readonly<Partial<P>>,
                                  setData: (data:D) => void) => {
  const [accessToken] = useAcquireToken()
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false

    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      const config = {
        params: params,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }
      HttpClient.get(initPath, config).then(
        (response) => {
          setData(response.data.data as D)
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

  return [isFetchInProgress] as const
}
