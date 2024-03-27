import React, { useState, createContext, useEffect } from 'react'
import { Company, CompaniesResource } from './types/Company'
import { useAcquireToken } from './hooks/auth'
import { getHeaders, HttpClient } from './HttpClient'
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
  const [accessToken] = useAcquireToken()
  const [companies, setCompanies] = useState<Company[] | undefined>(undefined)
  const [roles, setRoles] = useState<string[] | undefined>(undefined)

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
