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
  hasPackages: boolean | undefined;
}

const ExpiryWarning = ({ entry, hasPackages }: ExpiryWarningProps) => {
  const { t } = useTranslation()
  const showWarning = isEntryExpired(entry) ? hasPackages === false : false;
  const age = new Date().getTime() - new Date(entry.completed ?? entry.created).getTime();
  const days = Math.floor(age / (24 * 3600_000))

  return showWarning ? (
    <FdsAlertComponent
      style={{ width: 'fit-content', marginBottom: '24px' }}
      variant={FdsAlertVariant.warning}
      icon={'alert-triangle'}
    >
      {t('services:processingResults:expiryWarning', { days })} <br />
      {t('services:processingResults:dataNotAvailable')}
    </FdsAlertComponent>
  ) : (
    ''
  )
}

export default ExpiryWarning
