import { useState } from 'react'
import { Credential } from '../../../types/Credential.ts'
import { getHeaders, HttpClient } from '../../../HttpClient.ts'
import { Company } from '../../../types/Company.ts'

export const useCredentialsApi = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])

  const fetchCredentials = (owner: string, accessToken: string | null) => {

      if (accessToken && owner) {
        HttpClient.get('/api/v1/credentials', {
          params: { businessId: owner },
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        }).then(
          (response) => {
            const credentialData = Array.isArray(response.data?.data) ? response.data.data : [];
            setCredentials(credentialData);
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
