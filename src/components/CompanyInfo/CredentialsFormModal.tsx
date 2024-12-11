import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { Map } from '../../types/Map.ts'
import { useMsal } from '@azure/msal-react'
import { acquireToken } from '../../hooks/auth.ts'
import { getHeaders, HttpClient } from '../../HttpClient.ts'
import { FdsDialogComponent } from '../fds/FdsDialogComponent.ts'
import { FdsCardComponent } from '../fds/FdsCardComponent.ts'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card.ts'
import { FdsButtonComponent } from '../fds/FdsButtonComponent.ts'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button.ts'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { FdsInputComponent } from '../fds/FdsInputComponent.ts'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent.ts'
import { Credential, HttpBasicAuthenticationDetails, UpdateCredentialsRequest } from '../../types/Credential.ts'
import { generalListener } from '../../util/form.ts'
import { Company } from '../../types/Company.ts'
import { AuthenticationDetailsEditor } from './AuthenticationDetailsEditor.tsx'
import { FdsDropdownComponent } from '../fds/FdsDropdownComponent.ts'

type Mode = 'create' | 'edit';

interface ModalProps {
  mode: Mode
  close: () => void
  credential?: Credential
  owner: Company
  updateCredentialsCallback: (owner: Company, accessToken: string | null) => void
  modalStateCallback: (isOpen: boolean) => void
}

const typeOptions = [
  { label: 'HTTP Basic', value: 'HTTP Basic' }
];

const CredentialsFormModal = ({ mode, owner, close, credential, updateCredentialsCallback, modalStateCallback }: ModalProps) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Map>(
    {
      name: '' || credential?.name,
      type: '' || credential?.type,
      description: '' || credential?.description,
      details: {
        password: '',
        userId: ''
      },
      publicId: '' || credential?.publicId,
      owner: owner.businessId,
    }
  )
  const [formErrors, setFormErrors] = useState<Map>({})
  const { instance, inProgress } = useMsal()

  const saveCredentials = () => {

    if (!formData.name) {
      setFormErrors({
        name: t('formValidation:isRequired', { value: t('admin:company.credentials.modal.name') }),
      });
      return;
    }

    if (!formData.description) {
      setFormErrors({
        description: t('formValidation:isRequired', { value: t('admin:company.credentials.modal.description') }),
      });
      return;
    }

    if (!formData.type) {
      setFormErrors({
        type: t('formValidation:isRequired', { value: t('admin:company.credentials.modal.type') }),
      });
      return;
    }


    acquireToken(instance, inProgress).then(
      (tokenResult) => {
        if (!tokenResult) {
          // TODO: At some point, show some error notification
          return
        }

        const details: HttpBasicAuthenticationDetails = {
          userId: formData.details_userId as string,
          password: formData.details_password as string
        }

        const requestBody: UpdateCredentialsRequest = {
          name: formData.name as string,
          description: formData.description as string,
          type: formData.type as string,
          details: details,
          owner: owner.businessId
        }

        const httpRequest = mode === 'edit' && credential?.publicId !== undefined
          ? HttpClient.put(`/api/v1/credentials/` + credential?.publicId, requestBody, getHeaders(tokenResult.accessToken))
          : HttpClient.post(`/api/v1/credentials`, requestBody, getHeaders(tokenResult.accessToken))

        httpRequest.then((_response) => {
          updateCredentialsCallback(owner, tokenResult.accessToken)
          modalStateCallback(false)
        }, handleApiError)
      },
      (error) => {
        // TODO: show alert
        return Promise.reject(error)
      }
    )
  }

  const handleApiError = (error: any) => {
    if (error.response.status === 409) {
      setFormErrors({
        credential: t('formValidation:exists')
      })
    } else if (error.response.status === 404) {
      setFormErrors({
        credential: t('formValidation:notExists')
      })
    } else {
      setFormErrors({
        credential: error.message as string
      })
    }
    return Promise.reject(error)
  }

  const updateFormState = useCallback((newFormData: Map | null, newFormErrors: Map | null) => {
    if (newFormData) {
      console.log("new form data ", JSON.stringify(newFormData))
      setFormData(newFormData)
    }
    if (newFormErrors) {
      setFormErrors(newFormErrors)
    }
  }, [])

  const useGeneralListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      generalListener(e, updateFormState, formData, formErrors)
    },
    [updateFormState, formData, formErrors]
  )

  useEffect(() => {
    const credentialsElement = document.querySelector('[id="name"]')
    if (credentialsElement && credentialsElement.getAttribute('listener') !== 'true') {
      credentialsElement.addEventListener('change', useGeneralListener)
    }
    const credentialsDescriptionElement = document.querySelector('[id="description"]')
    if (credentialsDescriptionElement && credentialsDescriptionElement.getAttribute('listener') !== 'true') {
      credentialsDescriptionElement.addEventListener('change', useGeneralListener)
    }
    const credentialsTypeElement = document.querySelector('[id="type"]')
    if (credentialsTypeElement && credentialsTypeElement.getAttribute('listener') !== 'true') {
      credentialsTypeElement.addEventListener('select', useGeneralListener)
    }
    const credentialsDetailsElement = document.querySelector('[id="details"]')
    if (credentialsDetailsElement && credentialsDetailsElement.getAttribute('listener') !== 'true') {
      credentialsDetailsElement.addEventListener('change', useGeneralListener)
    }
    const credentialsUserIdElement = document.querySelector('[id="details_userId"]')
    if (credentialsUserIdElement && credentialsUserIdElement.getAttribute('listener') !== 'true') {
      credentialsUserIdElement.addEventListener('change', useGeneralListener)
    }
    const credentialsPasswordElement = document.querySelector('[id="details_password"]')
    if (credentialsPasswordElement && credentialsPasswordElement.getAttribute('listener') !== 'true') {
      credentialsPasswordElement.addEventListener('change', useGeneralListener)
    }

    return () => {
      credentialsElement?.removeEventListener('change', useGeneralListener)
      credentialsDescriptionElement?.removeEventListener('change', useGeneralListener)
      credentialsTypeElement?.removeEventListener('select', useGeneralListener)
      credentialsPasswordElement?.removeEventListener('change', useGeneralListener)
    }
  }, [useGeneralListener])

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">
            {credential ? t('admin:company.credentials.modal.edit', { credential }) : t('admin:company.credentials.modal.create')}
          </h4>
          <div style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}>
            {credential ? t('admin:company.credentials.modal.infoText', { credential }) : t('admin:company.credentials.modal.createInfoText') + owner.name}
          </div>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div
            id={'name'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}
            className={'input-wrapper'}
          >
            <FdsInputComponent
              clearable={true}
              name={'name'}
              label={t('admin:company.credentials.modal.name')}
              value={formData.name ? (formData.name as string) : ''}
              message={(formErrors.name as string) || ''}
              error={!!formErrors.name}
            />
          </div>
          <div
            id={'description'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}
            className={'input-wrapper'}
          >
            <FdsInputComponent
              clearable={true}
              name={'description'}
              label={t('admin:company.credentials.modal.description')}
              value={formData.description ? (formData.description as string) : ''}
              message={(formErrors.description as string) || ''}
              error={!!formErrors.description}
            />
          </div>
          <div
            id={'type'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}
            className={'input-wrapper'}
          >
            <FdsDropdownComponent
              name={'type'}
              label={t('admin:company.credentials.modal.type')}
              options={typeOptions}
              message={formErrors.type as string || ''}
              error={!!formErrors.type}
              value={formData.type ? typeOptions.filter((o) => o.value === formData.type)[0] : undefined}
            />
          </div>

          <div
            id={'details'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}
            className={'input-wrapper'}
          >
            <AuthenticationDetailsEditor
              authenticationDetails={formData}
              formErrors={formErrors}
              type={formData.type as string}
            /></div>
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
              onClick={saveCredentials}
              label={t('common:save')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default CredentialsFormModal
