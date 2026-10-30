import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
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
import LoadSpinner from '../Common/LoadSpinner/LoadSpinner'

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
  const [deleting, setDeleting] = useState(false)
  // Set synchronously, so a second click in the same tick is ignored before the state re-renders
  const deletingRef = useRef(false)
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

  // fds-button emits its click event even when disabled, so the handlers ignore calls while deleting
  const closeUnlessDeleting = () => {
    if (!deletingRef.current) {
      close()
    }
  }

  const stopDeleting = () => {
    deletingRef.current = false
    setDeleting(false)
  }

  const deleteCompany = async () => {
    if (deletingRef.current) {
      return
    }
    deletingRef.current = true
    setDeleting(true)
    setErrorMessage(null)
    const tokenResult = await acquireToken(instance, inProgress)
    if (!tokenResult) {
      stopDeleting()
      return
    }
    try {
      await HttpClient.delete(companyUrl, getHeaders(tokenResult.accessToken))
    } catch (e) {
      const error = e as AxiosError<{ data?: string | null }>
      const refusalKey =
        error.response?.status === 409 ? refusalMessageKeys[error.response.data?.data ?? ''] : undefined
      setErrorMessage(refusalKey ? t(refusalKey) : error.message)
      stopDeleting()
      return
    }
    // On success the deleting flag stays set: the spinner and disabled buttons remain until onDeleted() closes the modal
    onDeleted()
  }

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('admin:company:delete:title')}</h4>
          <FdsButtonComponent
            onClick={closeUnlessDeleting}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            disabled={deleting}
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
            {deleting && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LoadSpinner />
              </div>
            )}
          </div>

          <FdsActionSheetComponent>
            <FdsButtonComponent
              onClick={closeUnlessDeleting}
              slot="separated"
              icon="x"
              iconSize={FdsTokenSize2}
              variant={FdsButtonVariant.secondary}
              disabled={deleting}
              label={t('common:cancel')}
            />
            {references && (
              <FdsButtonComponent
                variant={FdsButtonVariant.danger}
                iconSize={FdsTokenSize2}
                disabled={deleting}
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
