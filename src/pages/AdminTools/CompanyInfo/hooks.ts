import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import { Company, CompanyHierarchy, CompanyInfoResource } from '../../../types/Company'
import { Ruleset } from '../../../types/Ruleset'
import { Context } from '../../../types/Context'

export const useCompanyInfoFetch = (
  accessToken: string | null,
  businessId: string | undefined,
  hasAdminRole: boolean | undefined,
  hasCompanyAdminRole: boolean | undefined
) => {
  const [company, setCompany] = useState<Company | undefined>(undefined)
  const [contexts, setContexts] = useState<Context[]>([])
  const [hierarchies, setHierarchies] = useState<CompanyHierarchy[]>([])
  const [rulesets, setRulesets] = useState<Ruleset[]>([])
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
          setContexts(companyInfo.data.contexts)
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

  return [company, contexts, hierarchies, rulesets, apiError, setCompany, setHierarchies, isFetchInProgress] as const
}
