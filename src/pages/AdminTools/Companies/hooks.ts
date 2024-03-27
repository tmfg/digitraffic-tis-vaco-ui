import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { Company } from '../../../types/Company'

export const useCompaniesFetch = (accessToken: string | null) => {
  const [companiesData, setCompaniesData] = useState<Company[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false

    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/admin/companies', getHeaders(accessToken)).then(
        (response) => {
          const companies = response.data.data as Company[]
          setCompaniesData(companies)
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

  return [companiesData, isFetchInProgress] as const
}
