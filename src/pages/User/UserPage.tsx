import { useTranslation } from 'react-i18next'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import UserInfo from '../../components/User/UserInfo'
import ServiceInfo from '../../components/User/ServiceInfo'

const UserPage = () => {
  const { t } = useTranslation()

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h1>{t('vaco:user')}</h1>
        <UserInfo />
        <ServiceInfo />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default UserPage
