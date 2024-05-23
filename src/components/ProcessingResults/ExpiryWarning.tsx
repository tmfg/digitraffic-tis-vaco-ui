import { Entry } from '../../types/EntryResource'
import { FdsAlertComponent } from '../fds/FdsAlertComponent'
import { FdsAlertVariant } from '../../../coreui-components/src/fds-alert'
import { useTranslation } from 'react-i18next'

const isEntryExpired = (entry: Entry) => {
  const sixDaysAgo = new Date(new Date().setDate(new Date().getDate() - 6))
  return new Date(entry.completed || entry.created) < sixDaysAgo
}

interface ExpiryWarningProps {
  entry: Entry
}

const ExpiryWarning = ({ entry }: ExpiryWarningProps) => {
  const { t } = useTranslation()
  return isEntryExpired(entry) ? (
    <FdsAlertComponent
      style={{ width: 'fit-content', marginBottom: '24px' }}
      variant={FdsAlertVariant.warning}
      icon={'alert-triangle'}
    >
      {t('services:processingResults:expiryWarning')} <br />
      {t('services:processingResults:dataNotAvailable')}
    </FdsAlertComponent>
  ) : (
    ''
  )
}

export default ExpiryWarning
