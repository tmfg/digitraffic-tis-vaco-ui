import { Outlet } from 'react-router-dom'
import FintrafficNavbar from './components/Navigation/FintrafficNavbar'
import Footer from './components/Footer/Footer'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import VacoAuthenticatedNavbar from './components/Navigation/vaco/VacoAuthenticatedNavbar'
import VacoLandingNavbar from './components/Navigation/vaco/VacoLandingNavbar'
import { isUserInTransition } from './hooks/auth'
import RedirectingPage from './pages/RedirectingPage'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { localStorageKey, supportedLocales } from './i18n'
import { useTranslation } from 'react-i18next'
import CompanyContextProvider from "./CompanyContextProvider";

const AppLayout = () => {
  const isAuthenticated = useIsAuthenticated()
  const { inProgress } = useMsal()
  const [searchParams] = useSearchParams()
  const langQueryParam = searchParams?.get('lang')
  const { i18n } = useTranslation()
  const selectedLocaleCode: string = i18n.resolvedLanguage || i18n.language

  useEffect(() => {
    // URL provided lang query param should overrule the localStorage-saved locale
    if (langQueryParam && selectedLocaleCode !== langQueryParam && supportedLocales.includes(langQueryParam)) {
      i18n
        .changeLanguage(langQueryParam)
        .catch(() => console.error('Error at attempt of changing i18n locale to ', langQueryParam))

      if (!localStorage.getItem(localStorageKey)) {
        localStorage.setItem(localStorageKey, langQueryParam)
      }
    }
  }, [langQueryParam, selectedLocaleCode, i18n])

  return (
    <div className={'app-layout'}>
      <FintrafficNavbar />
      {isUserInTransition(inProgress) && <div></div>}
      {isUserInTransition(inProgress) && <RedirectingPage />}
      {!isUserInTransition(inProgress) && (isAuthenticated ? <VacoAuthenticatedNavbar /> : <VacoLandingNavbar />)}
      {!isUserInTransition(inProgress) && (
        <CompanyContextProvider>
          <Outlet />
        </CompanyContextProvider>
      )}
      <Footer />
    </div>
  )
}

export default AppLayout
