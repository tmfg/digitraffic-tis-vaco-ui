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

interface ModalProps {
  close: () => void
  onCreated: (company: Company) => void
}

const AddCompanyModal = ({ close, onCreated }: ModalProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [name, setName] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [nameError, setNameError] = useState('')
  const [businessIdError, setBusinessIdError] = useState('')

  const inputsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wrapper = inputsRef.current
    const listener = (e: Event) => {
      const { name: inputName, value } = (e as CustomEvent).detail as FdsInputChange
      if (inputName === 'name') {
        setName(value as string)
        setNameError('')
      } else if (inputName === 'businessId') {
        setBusinessId(value as string)
        setBusinessIdError('')
      }
    }
    wrapper?.addEventListener('change', listener)
    return () => wrapper?.removeEventListener('change', listener)
  }, [])

  const save = () => {
    const trimmedName = name.trim()
    const trimmedBusinessId = businessId.trim()
    const newNameError = trimmedName ? '' : t('formValidation:isRequired', { value: t('admin:company:name') })
    const newBusinessIdError = isValidBusinessId(trimmedBusinessId)
      ? ''
      : t('formValidation:isInvalid', { value: t('admin:company:businessId') })
    setNameError(newNameError)
    setBusinessIdError(newBusinessIdError)
    if (newNameError || newBusinessIdError) {
      return
    }

    acquireToken(instance, inProgress).then((tokenResult) => {
      if (!tokenResult) {
        return
      }
      const requestBody: Company = { businessId: trimmedBusinessId, name: trimmedName, publish: true, roles: [] }
      HttpClient.post('/api/ui/admin/companies', requestBody, getHeaders(tokenResult.accessToken)).then(
        (response) => onCreated(response.data.data as Company),
        (error) => {
          if (error.response?.status === 409) {
            setBusinessIdError(t('formValidation:exists'))
          } else if (error.response?.status === 400) {
            setBusinessIdError(t('formValidation:isInvalid', { value: t('admin:company:businessId') }))
          } else {
            setBusinessIdError(error.message as string)
          }
        }
      )
    })
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
            <FdsInputComponent
              clearable={true}
              name={'name'}
              label={t('admin:company:name')}
              value={name}
              message={nameError}
              error={!!nameError}
            />
            <FdsInputComponent
              clearable={true}
              name={'businessId'}
              label={t('admin:company:businessId')}
              value={businessId}
              message={businessIdError}
              error={!!businessIdError}
            />
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
              onClick={save}
              label={t('common:save')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default AddCompanyModal
