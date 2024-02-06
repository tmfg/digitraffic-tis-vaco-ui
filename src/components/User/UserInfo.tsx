import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import { Company, CompanyResource } from '../../types/Company'
import { AccountInfo, InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import { parseJwt } from '../../util/jwt'

const UserInfo = () => {
  const { t } = useTranslation()
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()
  const [companies, setCompanies] = useState<Company[] | undefined>(undefined)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [account, setAccount] = useState<AccountInfo | undefined>(undefined)
  const [accountInfo, setAccountInfo] = useState<KeyValuePairItem[]>([])
  const [tokenInfo, setTokenInfo] = useState<KeyValuePairItem[]>([])
  const [companyInfo, setCompanyInfo] = useState<KeyValuePairItem[]>([])

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

      const account = instance.getActiveAccount()
      if (account) {
        setAccount(account)
      }
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

  useEffect(() => {
    if (account) {
      setAccountInfo([
        {
          label: t('user:name'),
          value: account.name
        },
        {
          label: t('user:username'),
          value: account.username
        }
      ])
    }
    if (accessToken) {
      const jwtObject = parseJwt(accessToken)
      if (jwtObject) {
        setTokenInfo([
          {
            label: t('user:email'),
            value: jwtObject.email
          },
          {
            label: t('user:roles'),
            value: jwtObject.roles ? jwtObject.roles.map((role) => <div>{role}</div>) : '-'
          }
        ])
      }
    }
    if (companies) {
      setCompanyInfo([
        {
          label: t('user:companies'),
          value: companies.length > 0 ? companies.map((c) => <div>{`${c.name} (${c.businessId})`}</div>) : '-'
        }
      ])
    }
  }, [account, accessToken, companies, t])

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <KeyValuePairs items={accountInfo.concat(tokenInfo).concat(companyInfo)} variant={KeyValuePairVariant.big} />
    </div>
  )
}

export default UserInfo
