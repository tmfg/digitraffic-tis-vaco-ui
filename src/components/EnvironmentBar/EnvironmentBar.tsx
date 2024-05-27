import './_environment-bar.scss'
import { useContext } from 'react'
import { EnvironmentContext } from '../../EnvironmentProvider'
import { useTranslation, Trans } from 'react-i18next'

const EnvironmentBar = () => {
  const { t } = useTranslation()
  const bootstrap = useContext(EnvironmentContext)

  return (
    <div className={`environment-bar environment-bar__${bootstrap?.environment}`}>
      <Trans i18nKey="environment:message" values={{ envName: t('environment:' + bootstrap?.environment) }}></Trans>
    </div>
  )
}

export default EnvironmentBar
