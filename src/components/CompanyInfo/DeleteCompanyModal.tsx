import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
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

const refusalMessageKeys: Record<string, string> = {
  IN_PROGRESS: 'admin:company:delete:inProgress',
  PROTECTED: 'admin:company:delete:protected'
}

const DeleteCompanyModal = ({ close, company, onDeleted }: ModalProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [references, setReferences] = useState<Record<string, number> | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const companyUrl = `/api/ui/admin/companies/${encodeURIComponent(company.businessId)}`

  useEffect(() => {
    let ignore = false
    const loadReferences = async () => {
      const tokenResult = await acquireToken(instance, inProgress)
      if (!tokenResult) {
        return
      }
      try {
        const response = await HttpClient.get<{ data: Record<string, number> }>(
          `${companyUrl}/references`,
          getHeaders(tokenResult.accessToken)
        )
        if (!ignore) {
          setReferences(response.data.data)
        }
      } catch (e) {
        if (!ignore) {
          setErrorMessage((e as AxiosError).message)
        }
      }
    }
    void loadReferences()
    return () => {
      ignore = true
    }
  }, [companyUrl, instance, inProgress])

  const deleteCompany = async () => {
    setErrorMessage(null)
    const tokenResult = await acquireToken(instance, inProgress)
    if (!tokenResult) {
      return
    }
    try {
      await HttpClient.delete(companyUrl, getHeaders(tokenResult.accessToken))
    } catch (e) {
      const error = e as AxiosError<{ data?: string | null }>
      const refusalKey =
        error.response?.status === 409 ? refusalMessageKeys[error.response.data?.data ?? ''] : undefined
      setErrorMessage(refusalKey ? t(refusalKey) : error.message)
      return
    }
    onDeleted()
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
            {references && Object.keys(references).length > 0 && (
              <FdsAlertComponent icon={'alert-triangle'}>
                <div>{t('admin:company:delete:linkedWarning')}</div>
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
            {references && (
              <FdsButtonComponent
                variant={FdsButtonVariant.danger}
                iconSize={FdsTokenSize2}
                onClick={() => void deleteCompany()}
                label={t('admin:company:delete:action')}
              />
            )}
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default DeleteCompanyModal
