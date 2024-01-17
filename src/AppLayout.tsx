import { Outlet } from 'react-router-dom'
import FintrafficNavbar from './components/Navigation/FintrafficNavbar'
import Footer from './components/Footer/Footer'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import VacoAuthenticatedNavbar from './components/Navigation/vaco/VacoAuthenticatedNavbar'
import VacoLandingNavbar from './components/Navigation/vaco/VacoLandingNavbar'
import { acquireToken, isUserInTransition } from './hooks/auth'
import RedirectingPage from './pages/RedirectingPage'
import { useSearchParams } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'
import { localStorageKey, supportedLocales } from './i18n'
import { useTranslation } from 'react-i18next'
import { getHeaders, HttpClient } from './HttpClient'
import { InteractionStatus } from '@azure/msal-browser'
import { Company } from './types/Company'

type CompanyContextType = Company[]
export const CompaniesContext = createContext<CompanyContextType>([])

const AppLayout = () => {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const langQueryParam = searchParams?.get('lang')
  const { i18n } = useTranslation()
  const selectedLocaleCode: string = i18n.resolvedLanguage || i18n.language
  const [companies, setCompanies] = useState<Company[] | null>(null)

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

  useEffect(() => {
    let ignore = false
    if (inProgress === InteractionStatus.None && !ignore && isAuthenticated && !accessToken) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }
          setAccessToken(tokenResult.accessToken)
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }

    return () => {
      ignore = true
    }
  }, [instance, inProgress, isAuthenticated, accessToken])

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      HttpClient.get('/api/me', getHeaders(accessToken)).then(
        (response) => {
          if (response?.data) {
            const companies = response.data.data.companies as Company[]
            setCompanies(companies || [])
          }
        },
        (error) => {
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken])

  return companies ? (
    <CompaniesContext.Provider value={companies}>
      <div className={'app-layout'}>
        <FintrafficNavbar />
        {isUserInTransition(inProgress) && <div></div>}
        {isUserInTransition(inProgress) && <RedirectingPage />}
        {!isUserInTransition(inProgress) && (isAuthenticated ? <VacoAuthenticatedNavbar /> : <VacoLandingNavbar />)}
        {!isUserInTransition(inProgress) && <Outlet />}
        <Footer />
      </div>
    </CompaniesContext.Provider>
  ) : (
    <></>
  )
}

export default AppLayout
