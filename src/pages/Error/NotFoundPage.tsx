import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className={'page-content'}>
      <h3>{t('error:notFound')}</h3>
      <p>
        <Link to="/">{t('error:return')}</Link>
      </p>
    </div>
  )
}

export default NotFoundPage
