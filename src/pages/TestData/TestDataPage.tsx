import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import Form from '../../components/TestData/Form'
import { useContext } from 'react'
import NoCompaniesErrorPage from '../Error/NoCompaniesErrorPage'
import { CompanyContext, CompanyContextType } from '../../CompanyContextProvider'

const TestDataPage = () => {
  const { t } = useTranslation()
  const companies: CompanyContextType = useContext(CompanyContext)

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h1>{t('services:testData:header')}</h1>
        {companies && companies.length > 0 ? (
          <>
            <div className={'page-intro'}>{t('services:testData:intro')}</div>
            <Form />
          </>
        ) : !companies ? (
          <></>
        ) : (
          <NoCompaniesErrorPage />
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default TestDataPage
