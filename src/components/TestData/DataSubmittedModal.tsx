import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import './_modal.scss'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { FdsTokenSize2 } from '../../../coreui-css/lib'

interface ModalProps {
  close: () => void
  proceed: () => void
  email: string
  publicId: string
}

const DataSubmittedModal = ({ close, proceed, email, publicId }: ModalProps) => {
  const { t } = useTranslation()

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('services:testData:modal:title')}</h4>

          <ul>
            <li>
              <Trans i18nKey="services:testData:modal:accessBy" values={{ publicId: publicId }}></Trans>
            </li>

            <li>
              <Trans i18nKey="services:testData:modal:notification" values={{ email: email }}></Trans>
            </li>

            <li>{t('services:testData:modal:toProceed')}</li>
          </ul>

          <FdsActionSheetComponent>
            <FdsButtonComponent
              onClick={close}
              slot="separated"
              icon="x"
              iconSize={FdsTokenSize2}
              variant={FdsButtonVariant.secondary}
              label={t('common:close')}
            />
            <FdsButtonComponent
              icon="navigation"
              iconSize={FdsTokenSize2}
              onClick={proceed}
              label={t('common:proceed')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default DataSubmittedModal
