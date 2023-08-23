import { useTranslation } from 'react-i18next'

const DashboardPage = () => {
  const { t } = useTranslation()

  return (
    <div className={'sub-page '}>
      <h2>{t('translations:dashboard')}</h2>
    </div>
  )
}

export default DashboardPage
