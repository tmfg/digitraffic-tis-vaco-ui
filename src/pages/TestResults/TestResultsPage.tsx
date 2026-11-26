import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../../AppContextProvider'
import { useOptionalAccessToken } from '../../hooks/optionalAccessToken'
import LoadSpinner from '../../components/Common/LoadSpinner/LoadSpinner'
import MyDataPage from '../MyData/MyDataPage'
import { hasOwnCompany } from '../../util/company'
import { PublicValidationTest } from '../../types/PublicValidationTest'

/**
 * The "Test and validation results" route. A user with a company of their own sees the own data publications page. A
 * visitor and a user without a company of their own go to the public validation test company.
 */
const TestResultsPage = () => {
  const [accessToken, ready] = useOptionalAccessToken()
  const { companies } = useContext(AppContext)

  const isLoggedIn = accessToken !== null
  const waitingForCompanies = isLoggedIn && companies === undefined
  if (!ready || waitingForCompanies) {
    return <LoadSpinner />
  }

  if (!isLoggedIn || !hasOwnCompany(companies)) {
    return <Navigate to={'/data/companies/' + PublicValidationTest.businessId} replace />
  }
  return <MyDataPage accessToken={accessToken} />
}

export default TestResultsPage
