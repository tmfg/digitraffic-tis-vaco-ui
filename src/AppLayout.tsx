import { Outlet } from 'react-router-dom'
import FintrafficNavbar from './components/Navigation/FintrafficNavbar'
import Footer from './components/Footer'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import VacoAuthenticatedNavbar from './components/Navigation/VacoAuthenticatedNavbar'
import VacoLandingNavbar from './components/Navigation/VacoLandingNavbar'
import { isUserInTransition } from './hooks/auth'

const AppLayout = () => {
  const isAuthenticated = useIsAuthenticated()
  const { inProgress } = useMsal()
  return (
    <div className={'app-layout'}>
      <FintrafficNavbar />
      {isUserInTransition(inProgress) && <></>}
      {!isUserInTransition(inProgress) && (isAuthenticated ? <VacoAuthenticatedNavbar /> : <VacoLandingNavbar />)}
      {!isUserInTransition(inProgress) && <Outlet />}
      <Footer />
    </div>
  )
}

export default AppLayout
