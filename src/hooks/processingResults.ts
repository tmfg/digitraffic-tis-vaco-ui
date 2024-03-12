import { useEffect, useState } from "react";
import { ProcessingResultsPageResource } from "../types/ProcessingResultsPageResource.ts";
import { useMsal } from "@azure/msal-react";
import { acquireToken } from "./auth.ts";
import { getHeaders, HttpClient } from "../HttpClient.ts";

export const useProcessingResultsPageData = (entryId:string |undefined) => {
  const [pageData, setPageData] = useState<ProcessingResultsPageResource | null>(null);
  const { instance, inProgress } = useMsal()

  useEffect(() => {
    if (entryId) {
      acquireToken(instance, inProgress).then((tokenResult) => {
        if (tokenResult) {
          HttpClient.get('/api/ui/processing-results/' + entryId, getHeaders(tokenResult.accessToken)).then(
            (response) => {
              setPageData(response.data as ProcessingResultsPageResource)
            },
            (error) => {
              return Promise.reject(error)
            }
          )
        }
      })
    }
  }, [])

  return [pageData] as const;
}
