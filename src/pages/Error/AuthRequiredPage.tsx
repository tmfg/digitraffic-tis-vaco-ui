import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";

const AuthRequiredPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <h3>{t('error:authRequired')}</h3>
      <p>
        <Link to="/">{t('error:return')}</Link>
      </p>
    </>
  )
}

export default AuthRequiredPage
