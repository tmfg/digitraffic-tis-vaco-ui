import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { useAcquireToken } from '../../../hooks/auth'
import AdminRoleRequiredPage from '../../Error/AdminRoleRequiredPage'
import AuthRequiredPage from '../../Error/AuthRequiredPage'
import { useParams } from 'react-router-dom'
import CompanyDetails from '../../../components/CompanyInfo/CompanyDetails'
import Rulesets from '../../../components/CompanyInfo/Rulesets'
import { FdsAlertComponent } from '../../../components/fds/FdsAlertComponent'
import CompanyHierarchyTree from '../../../components/CompanyInfo/CompanyHierarchyTree'
import { useAdminRightsCheck } from '../hooks'
import { useCompanyInfoFetch } from './hooks'
import LoadSpinner, { SpinnerVariant } from '../../../components/Common/LoadSpinner/LoadSpinner'
import { useTranslation } from 'react-i18next'
import { getCompanyFullName } from '../../../util/company'
import Contexts from '../../../components/CompanyInfo/Contexts'
import Subscriptions from '../../../components/CompanyInfo/Subscriptions.tsx'
import Credentials from '../../../components/CompanyInfo/Credentials.tsx'

const CompanyInfoPage = () => {
  const { t } = useTranslation()
  const [accessToken] = useAcquireToken()
  const [hasAdminRole, hasCompanyAdminRole] = useAdminRightsCheck()
  const { businessId } = useParams()
  const [company, contexts, hierarchies, rulesets, apiError, setCompany, setHierarchies, isFetchInProgress] =
    useCompanyInfoFetch(accessToken, businessId, hasAdminRole, hasCompanyAdminRole)

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        {(hasAdminRole || hasCompanyAdminRole) && company && (
          <>
            <h1>{getCompanyFullName(company.name, company.businessId, t)}</h1>
            {isFetchInProgress && <LoadSpinner variant={SpinnerVariant.padded} />}
            <>
              <CompanyDetails
                company={company}
                onEditCompanyCallback={setCompany}
                onEditHierarchiesCallback={setHierarchies}
              />
              <CompanyHierarchyTree company={company} hierarchies={hierarchies} />
              <Subscriptions
                key={'subscriptions-' + company.businessId}
                accessToken={accessToken}
                businessId={company.businessId}
              />
              <Credentials
                accessToken={accessToken}
                owner={company}
              />
              <Contexts key={'contexts-' + company.businessId} contexts={contexts} businessId={company.businessId} />
              <Rulesets key={'rulesets-' + company.businessId} rulesets={rulesets} />
            </>
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
