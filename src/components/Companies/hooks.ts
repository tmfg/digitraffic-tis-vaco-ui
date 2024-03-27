import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { Company, CompanyHierarchy } from '../../types/Company'

export const useCompaniesHierarchyFetch = (accessToken: string | null, selectedCompany: Company | null) => {
  const [hierarchiesData, setHierarchiesData] = useState<CompanyHierarchy[] | undefined>(undefined)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false

    if (accessToken && !ignore) {
      setIsFetchInProgress(true)
      HttpClient.get(
        `/api/ui/admin/companies/hierarchy?businessId=${selectedCompany?.businessId ? selectedCompany.businessId : ''}`,
        getHeaders(accessToken)
      ).then(
        (response) => {
          const hierarchies = response.data.data as CompanyHierarchy[]
          setHierarchiesData(hierarchies)
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
  }, [accessToken, selectedCompany?.businessId])

  return [hierarchiesData, setHierarchiesData, isFetchInProgress] as const
}
