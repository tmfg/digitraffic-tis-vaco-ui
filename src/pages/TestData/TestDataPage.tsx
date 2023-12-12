import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import Form from '../../components/TestData/Form'

const TestDataPage = () => {
  const { t } = useTranslation()

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h1>{t('services:testData:header')}</h1>
        <div className={'page-intro'}>
          {t('services:testData:shortIntro')}
          <br />
          {t('services:testData:intro')}
        </div>
        <Form />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default TestDataPage
