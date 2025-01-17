import { useContext, useEffect, useState } from 'react'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../..//util/role'
import { AppContext, AppContextType } from '../../../AppContextProvider'
import { Credential } from '../../../types/Credential.ts'
import { getHeaders, HttpClient } from '../../../HttpClient.ts'
import { Company } from '../../../types/Company.ts'

export const useAdminRightsCheck = () => {
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
  }, [appContext])

  return [hasAdminRole, hasCompanyAdminRole] as const
}

export const useCredentialsApi = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])

  const fetchCredentials = (owner: string, accessToken: string | null) => {

      if (accessToken && owner) {
        HttpClient.get('/api/v1/credentials', {
          params: { businessId: owner },
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        }).then(
          (response) => {
            setCredentials(response.data?.data as Credential[])
          },
          (_error) => {}
        )
      }
    }

  const reloadCredentials = (owner: Company, accessToken: string | null) => {
    if (accessToken && owner) {
      HttpClient.get('/api/v1/credentials', {
        params: { businessId: owner.businessId },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }).then(
        (response) => {
          setCredentials(response.data?.data as Credential[])
        },
        (_error) => {}
      )
    }
  }

  const deleteCredentials = (credentials: Credential, accessToken: string | null): Promise<boolean> => {
    if (accessToken && credentials) {
      return HttpClient.delete('api/v1/credentials/' + credentials.publicId, getHeaders(accessToken)).then(
        (_response) => {
          return true
        },
        (_error) => {
          return false
        }
      )
    } else {
      return Promise.reject(false)
    }
  }

  return [credentials, reloadCredentials, deleteCredentials, fetchCredentials] as const
}
