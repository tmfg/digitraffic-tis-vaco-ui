import { useTranslation } from 'react-i18next'
import Form from '../../components/TestData/Form'

const TestDataPage = () => {
  const { t } = useTranslation()

  return (
    <div className={'page-content'}>
      <h1>{t('services:testData:header')}</h1>
      <div className={'page-intro'}>{t('services:testData:intro')}</div>
      <Form />
    </div>
  )
}

export default TestDataPage
