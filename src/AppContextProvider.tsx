import React, { useState, createContext, useEffect } from 'react'
import { Company, CompaniesResource } from './types/Company'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from './hooks/auth'
import { getHeaders, HttpClient } from './HttpClient'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { parseJwt } from './util/jwt'

export type AppContextType = {
  companies: Company[] | undefined
  roles: string[] | undefined
}
export const AppContext = createContext<AppContextType>({ companies: undefined, roles: undefined })
interface AppContextProviderProps {
  children: React.ReactNode
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()
  const [companies, setCompanies] = useState<Company[] | undefined>(undefined)
  const [roles, setRoles] = useState<string[] | undefined>(undefined)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)

  /**
   * If user is authenticated, let's fetch their company/azure ad info
   */
  useEffect(() => {
    let ignore = false
    if (inProgress === InteractionStatus.None && !ignore && !accessToken && isAuthenticated) {
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
    if (accessToken && !ignore && !companies) {
      HttpClient.get('/api/me', getHeaders(accessToken)).then(
        (response) => {
          const responseData: CompaniesResource = response.data as CompaniesResource
          if (responseData) {
            const companiesData: Company[] = responseData.data.companies
            setCompanies(companiesData)
          }
        },
        (error) => {
          console.error('Failed to fetch /me data', error)
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken, companies])

  useEffect(() => {
    if (accessToken && !roles) {
      const jwtObject = parseJwt(accessToken)
      setRoles(jwtObject?.roles || [])
    }
  }, [accessToken, roles])

  return <AppContext.Provider value={{ companies, roles }}>{children}</AppContext.Provider>
}

export default AppContextProvider
