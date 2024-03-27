import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { Company, CompanyHierarchy, CompanyInfoResource } from '../../../types/Company'
import { Ruleset } from '../../../types/Ruleset'

export const useCompanyInfoFetch = (
  accessToken: string | null,
  businessId: string | undefined,
  hasAdminRole: boolean | undefined,
  hasCompanyAdminRole: boolean | undefined
) => {
  const [company, setCompany] = useState<Company | undefined>(undefined)
  const [hierarchies, setHierarchies] = useState<CompanyHierarchy[] | undefined>(undefined)
  const [rulesets, setRulesets] = useState<Ruleset[] | undefined>(undefined)
  const [apiError, setApiError] = useState<any>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore && businessId && (hasAdminRole || hasCompanyAdminRole)) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/admin/companies/' + businessId + '/info', getHeaders(accessToken)).then(
        (response) => {
          const companyInfo = response.data as CompanyInfoResource
          setCompany(companyInfo.data.company)
          setHierarchies(companyInfo.data.hierarchies)
          setRulesets(companyInfo.data.rulesets)
          setIsFetchInProgress(false)
        },
        (error) => {
          setApiError(error)
          setIsFetchInProgress(false)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken, businessId, hasAdminRole, hasCompanyAdminRole])

  return [company, hierarchies, rulesets, apiError, setCompany, setHierarchies, isFetchInProgress] as const
}
