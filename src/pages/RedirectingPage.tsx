import { useTranslation } from "react-i18next";

const RedirectingPage = () => {
  const { t } = useTranslation()
  return (
    <div className={'page-content'}>
      <h1 style={{ color: '#0034ac' }}>{t('vaco:redirecting')}</h1>
    </div>
  )
}

export default RedirectingPage
