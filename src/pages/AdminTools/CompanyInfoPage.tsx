import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useContext, useEffect, useState } from 'react'
import { AppContext, AppContextType } from '../../AppContextProvider'
import { Company, CompanyHierarchy, CompanyInfoResource } from '../../types/Company'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import AdminRoleRequiredPage from '../Error/AdminRoleRequiredPage'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useParams, useLocation } from 'react-router-dom'
import CompanyDetails from '../../components/CompanyInfo/CompanyDetails'
import Rulesets from '../../components/CompanyInfo/Rulesets'
import { FdsAlertComponent } from '../../components/fds/FdsAlertComponent'
import CompanyHierarchyTree from '../../components/CompanyInfo/CompanyHierarchyTree'
import { Ruleset } from '../../types/Ruleset'

const CompanyInfoPage = () => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)
  const { businessId } = useParams()
  const [company, setCompany] = useState<Company | undefined>(undefined)
  const [hierarchies, setHierarchies] = useState<CompanyHierarchy[] | undefined>(undefined)
  const [rulesets, setRulesets] = useState<Ruleset[] | undefined>(undefined)
  const [apiError, setApiError] = useState<any>(null)
  const { state } = useLocation()

  useEffect(() => {
    if (state) {
      // Time to scroll to the top to signify the page content's refreshing
      // Happens when clicking on a different company from the company hierarchy component
      // window.scrollTo(0, 0)
    }
  }, [state])

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
  }, [appContext])

  useEffect(() => {
    let ignore = false

    if (inProgress === InteractionStatus.None && isAuthenticated && !ignore && !accessToken) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }
          setAccessToken(tokenResult.accessToken)
        },
        (error) => {
          setApiError(error)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [instance, inProgress, accessToken, isAuthenticated])

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore && businessId && (hasAdminRole || hasCompanyAdminRole)) {
      HttpClient.get('/api/ui/admin/companies/' + businessId + '/info', getHeaders(accessToken)).then(
        (response) => {
          const companyInfo = response.data as CompanyInfoResource
          setCompany(companyInfo.data.company)
          setHierarchies(companyInfo.data.hierarchies)
          setRulesets(companyInfo.data.rulesets)
        },
        (error) => {
          setApiError(error)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken, businessId, hasAdminRole, hasCompanyAdminRole])

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        {(hasAdminRole || hasCompanyAdminRole) && company && hierarchies && (
          <>
            <h1>
              {company.name} ({company.businessId})
            </h1>
            {(hasAdminRole || hasCompanyAdminRole) && (
              <>
                <CompanyDetails
                  company={company}
                  onEditCompanyCallback={setCompany}
                  onEditHierarchiesCallback={setHierarchies}
                />
                <CompanyHierarchyTree company={company} hierarchies={hierarchies} />
                <Rulesets rulesets={rulesets} />
              </>
            )}
          </>
        )}
        {hasAdminRole !== undefined && hasCompanyAdminRole !== undefined && !(hasAdminRole || hasCompanyAdminRole) && (
          <AdminRoleRequiredPage />
        )}
        {apiError && (
          <div style={{ width: 'fit-content', marginTop: '2.5rem' }}>
            <FdsAlertComponent icon={'alert-triangle'}>
              <div>{apiError?.message || 'Error occurred'}</div>
            </FdsAlertComponent>
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default CompanyInfoPage
