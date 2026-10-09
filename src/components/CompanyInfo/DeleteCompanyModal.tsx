import { useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsAlertComponent } from '../fds/FdsAlertComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import '../TestData/SubmissionModal/_modal.scss'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { Company } from '../../types/Company'
import { getCompanyFullName } from '../../util/company'
import LinkedDataList from './LinkedDataList'

interface ModalProps {
  close: () => void
  company: Company
  onDeleted: () => void
}

const DeleteCompanyModal = ({ close, company, onDeleted }: ModalProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [references, setReferences] = useState<Record<string, number> | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const deleteCompany = () => {
    setReferences(null)
    setErrorMessage(null)
    acquireToken(instance, inProgress).then((tokenResult) => {
      if (!tokenResult) {
        return
      }
      HttpClient.delete(
        `/api/ui/admin/companies/${encodeURIComponent(company.businessId)}`,
        getHeaders(tokenResult.accessToken)
      ).then(onDeleted, (error) => {
        if (error.response?.status === 409) {
          const linked = error.response.data?.data as Record<string, number> | null | undefined
          if (linked && Object.keys(linked).length > 0) {
            setReferences(linked)
          } else {
            setErrorMessage(t('admin:company:delete:protected'))
          }
        } else {
          setErrorMessage(error.message as string)
        }
      })
    })
  }

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('admin:company:delete:title')}</h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div style={{ marginBottom: '2.5rem', maxWidth: '32rem' }}>
            <p>
              {t('admin:company:delete:confirm', { company: getCompanyFullName(company.name, company.businessId, t) })}
            </p>
            {references && (
              <FdsAlertComponent icon={'alert-triangle'}>
                <div>{t('admin:company:delete:refused')}</div>
                <LinkedDataList references={references} />
              </FdsAlertComponent>
            )}
            {errorMessage && (
              <FdsAlertComponent icon={'alert-triangle'}>
                <div>{errorMessage}</div>
              </FdsAlertComponent>
            )}
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
              onClick={deleteCompany}
              label={t('admin:company:delete:action')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default DeleteCompanyModal
