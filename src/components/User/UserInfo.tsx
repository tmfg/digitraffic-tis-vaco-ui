import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import { Company, CompaniesResource } from '../../types/Company'
import { AccountInfo } from '@azure/msal-browser'
import { useAcquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import { parseJwt } from '../../util/jwt'
import { getCompanyFullName } from '../../util/company'
import { Link } from 'react-router-dom'
import './_UserInfo.scss'

const UserInfo = () => {
  const { t } = useTranslation()
  const [accessToken] = useAcquireToken()
  const { instance } = useMsal()
  const [companies, setCompanies] = useState<Company[] | undefined>(undefined)
  const [account, setAccount] = useState<AccountInfo | undefined>(undefined)
  const [accountInfo, setAccountInfo] = useState<KeyValuePairItem[]>([])
  const [tokenInfo, setTokenInfo] = useState<KeyValuePairItem[]>([])
  const [companyInfo, setCompanyInfo] = useState<KeyValuePairItem[]>([])

  useEffect(() => {
    if (instance) {
      const account = instance.getActiveAccount()
      if (account) {
        setAccount(account)
      }
    }
    return () => {}
  }, [instance])

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
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
          value:
            companies.length > 0
              ? companies.map((c) => (
                  <div key={c.businessId}>
                    {getCompanyFullName(c.name, c.businessId, t) +
                      ' / ' +
                      t('admin:company.publish') +
                      ' ' +
                      (c.publish ? t('common:yes') : t('common:no'))}
                  </div>
                ))
              : '-'
        }
      ])
    }
  }, [account, accessToken, companies, t])

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <KeyValuePairs items={accountInfo.concat(tokenInfo).concat(companyInfo)} variant={KeyValuePairVariant.big} />
      <Link
        className="hiddenLink"
        to={'https://jwt.ms/#access_token=' + accessToken}
        target={'_blank'} rel={'noopener noreferrer nofollow'}>
        debug token on JWT.ms</Link>
    </div>
  )
}

export default UserInfo
