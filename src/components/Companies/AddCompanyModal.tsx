import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import '../TestData/SubmissionModal/_modal.scss'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { Company } from '../../types/Company'
import { isValidBusinessId } from '../../util/company'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { Map } from '../../types/Map'
import { getNewFormErrorsState, getNewFormState } from '../../util/form'

interface ModalProps {
  close: () => void
  onCreated: (company: Company) => void
}

// Reserves room for a two-line validation message so the dialog does not resize when one appears
const fieldStyle = { minHeight: '114px' }

const errorMessageKeys: Record<number, string> = {
  400: 'admin:companies:add:invalidBusinessId',
  409: 'formValidation:exists'
}

const AddCompanyModal = ({ close, onCreated }: ModalProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [formData, setFormData] = useState<Map>({})
  const [formErrors, setFormErrors] = useState<Map>({})

  const inputsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = inputsRef.current
    const listener = (e: Event) => {
      const inputChange = (e as CustomEvent).detail as FdsInputChange
      setFormData((previous) => getNewFormState(previous, inputChange))
      setFormErrors((previous) => getNewFormErrorsState(previous, inputChange))
    }
    wrapper?.addEventListener('change', listener)
    return () => wrapper?.removeEventListener('change', listener)
  }, [])

  const apiErrorMessage = (error: AxiosError): string => {
    const messageKey = errorMessageKeys[error.response?.status ?? 0]
    return messageKey ? t(messageKey) : error.message
  }

  const save = async () => {
    const trimmedName = ((formData.name as string | undefined) ?? '').trim()
    const trimmedBusinessId = ((formData.businessId as string | undefined) ?? '').trim()
    const newFormErrors: Map = {
      name: trimmedName ? undefined : t('formValidation:isRequired', { value: t('admin:company:name') }),
      businessId: isValidBusinessId(trimmedBusinessId) ? undefined : t('admin:companies:add:invalidBusinessId')
    }
    setFormErrors(newFormErrors)
    if (newFormErrors.name || newFormErrors.businessId) {
      return
    }

    const tokenResult = await acquireToken(instance, inProgress)
    if (!tokenResult) {
      return
    }
    const requestBody: Company = { businessId: trimmedBusinessId, name: trimmedName, publish: true, roles: [] }
    let response
    try {
      response = await HttpClient.post('/api/ui/admin/companies', requestBody, getHeaders(tokenResult.accessToken))
    } catch (e) {
      const error = e as AxiosError
      setFormErrors({ businessId: apiErrorMessage(error) })
      return
    }
    onCreated(response.data.data as Company)
  }

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('admin:companies:add:title')}</h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div
            ref={inputsRef}
            style={{ textAlign: 'left', width: '26rem', marginBottom: '3rem' }}
            className={'input-wrapper'}
          >
            <div style={fieldStyle}>
              <FdsInputComponent
                clearable={true}
                name={'name'}
                label={t('admin:company:name')}
                value={(formData.name as string | undefined) ?? ''}
                message={(formErrors.name as string | undefined) ?? ''}
                error={!!formErrors.name}
              />
            </div>
            <div style={fieldStyle}>
              <FdsInputComponent
                clearable={true}
                name={'businessId'}
                label={t('admin:company:businessId')}
                value={(formData.businessId as string | undefined) ?? ''}
                message={(formErrors.businessId as string | undefined) ?? ''}
                error={!!formErrors.businessId}
              />
            </div>
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
              variant={FdsButtonVariant.primary}
              iconSize={FdsTokenSize2}
              onClick={() => void save()}
              label={t('common:save')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default AddCompanyModal
