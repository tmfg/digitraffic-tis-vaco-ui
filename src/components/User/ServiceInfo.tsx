import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../Common/KeyValuePairs/KeyValuePairs.tsx'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useState } from 'react'
import { EnvironmentContext } from '../../EnvironmentProvider.tsx'

const ServiceInfo = () => {
  const bootstrap = useContext(EnvironmentContext)
  const { t } = useTranslation()
  const [serviceInfo, setServiceInfo] = useState<KeyValuePairItem[]>([])

  useEffect(() => {
    if (bootstrap) {
      setServiceInfo([{ label: t('service:buildInfo'), value: bootstrap.buildInfo }])
    }
  }, [bootstrap, t])

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <KeyValuePairs items={serviceInfo} variant={KeyValuePairVariant.big} />
    </div>
  )
}

export default ServiceInfo
