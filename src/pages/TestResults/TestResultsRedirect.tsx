import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../../AppContextProvider'
import { useOptionalAccessToken } from '../../hooks/optionalAccessToken'
import LoadSpinner from '../../components/Common/LoadSpinner/LoadSpinner'
import { PublicValidationTest } from '../../types/PublicValidationTest'

/**
 * Opens the company entries page for the "Test and validation results" menu item. A visitor and a user without a
 * company get the public validation test company. A user with companies gets the first one by name.
 */
const TestResultsRedirect = () => {
  const [accessToken, ready] = useOptionalAccessToken()
  const { companies } = useContext(AppContext)

  const waitingForCompanies = accessToken !== null && companies === undefined
  if (!ready || waitingForCompanies) {
    return <LoadSpinner />
  }

  const firstCompany = [...(companies ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'fi'))[0]
  const businessId = firstCompany?.businessId ?? PublicValidationTest.businessId
  return <Navigate to={'/data/companies/' + businessId} replace />
}

export default TestResultsRedirect
