import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import '../TestData/SubmissionModal/_modal.scss'
import { useTranslation } from 'react-i18next'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { getCompanyName } from '../../util/company'

interface ModalProps {
  close: () => void
  proceed: () => void
  oldCompanyA: string | undefined
  newCompanyA: string | undefined
  companyB: string
}

const MoveUpPartnershipModal = ({ close, proceed, oldCompanyA, newCompanyA, companyB }: ModalProps) => {
  const { t } = useTranslation()

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('common:confirmation')}</h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div style={{ marginBottom: '1rem' }}>
            {t('admin:partnership:moveUpModalLine1', {
              companyB: getCompanyName(companyB, t)
            })}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            {t('admin:partnership:moveUpModalLine2', {
              oldCompanyA: getCompanyName(oldCompanyA, t),
              companyB: getCompanyName(companyB, t)
            })}
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            {t('admin:partnership:moveUpModalLine3', {
              newCompanyA: getCompanyName(newCompanyA, t),
              companyB: getCompanyName(companyB, t)
            })}
          </div>

          <FdsActionSheetComponent>
            <FdsButtonComponent
              onClick={close}
              slot="separated"
              icon="x"
              iconSize={FdsTokenSize2}
              variant={FdsButtonVariant.secondary}
              label={t('common:cancel')}
            />
            <FdsButtonComponent
              variant={FdsButtonVariant.danger}
              iconSize={FdsTokenSize2}
              onClick={proceed}
              label={t('admin:partnership:moveUp')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default MoveUpPartnershipModal
