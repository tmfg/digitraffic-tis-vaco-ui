import React, { useState, createContext, useEffect } from 'react'
import { Company, CompanyResource } from './types/Company'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from './hooks/auth'
import { getHeaders, HttpClient } from './HttpClient'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'

export type CompanyContextType = Company[] | undefined
export const CompanyContext = createContext<CompanyContextType>([])
interface CompanyContextProviderProps {
  children: React.ReactNode
}

const CompanyContextProvider = ({ children }: CompanyContextProviderProps) => {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()
  const [companies, setCompanies] = useState<Company[] | undefined>(undefined)
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
    if (accessToken && !ignore) {
      HttpClient.get('/api/me', getHeaders(accessToken)).then(
        (response) => {
          const responseData: CompanyResource = response.data as CompanyResource
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
  }, [accessToken])

  return <CompanyContext.Provider value={companies}>{children}</CompanyContext.Provider>
}

export default CompanyContextProvider
