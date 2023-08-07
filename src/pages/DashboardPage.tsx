import { useTranslation } from 'react-i18next'

const DashboardPage = () => {
  const { t } = useTranslation()

  return <h1>{t('translations:dashboard')}</h1>
}

export default DashboardPage
