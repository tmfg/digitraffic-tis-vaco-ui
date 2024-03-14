import { useEffect, useState } from 'react'
import { ProcessingResultsPageResource } from '../../types/ProcessingResultsPageResource'
import { getHeaders, HttpClient } from '../../HttpClient'

export const useMagicLinkFetch = (entryId: string | undefined, accessToken: string | null) => {
  const [magicLinkToken, setMagicLinkToken] = useState<string | null>(null)

  useEffect(() => {
    if (accessToken && entryId) {
      HttpClient.get('/api/ui/processing-results/' + entryId, getHeaders(accessToken)).then(
        (response) => {
          const pageDataResource = response.data as ProcessingResultsPageResource
          setMagicLinkToken(pageDataResource.data.magicLinkToken)
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    }
  }, [accessToken, entryId])

  return [magicLinkToken] as const
}
