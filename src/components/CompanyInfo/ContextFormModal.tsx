import { useTranslation } from 'react-i18next'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { useCallback, useEffect, useState } from 'react'
import { Map } from '../../types/Map'
import { generalListener } from '../../util/form'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { Context } from '../../types/Context'
import { useMsal } from '@azure/msal-react'

interface ModalProps {
  close: () => void
  context: string | null
  businessId: string
  updateContextsCallback: (c: Context[]) => void
  modalStateCallback: (isOpen: boolean) => void
}

const ContextFormModal = ({ close, context, updateContextsCallback, businessId, modalStateCallback }: ModalProps) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Map>(context ? { context } : {})
  const [formErrors, setFormErrors] = useState<Map>({})
  const { instance, inProgress } = useMsal()

  const saveContext = () => {
    if (!formData.context) {
      setFormErrors({
        context: t('formValidation:isRequired', { value: t('admin:company.context') })
      })
      return
    }
    if (context && formData.context === context) {
      modalStateCallback(false)
      return
    }
    acquireToken(instance, inProgress).then(
      (tokenResult) => {
        if (!tokenResult) {
          // TODO: At some point, show some error notification
          return
        }
        const requestBody: Context = {
          context: formData.context as string,
          businessId: businessId
        }
        const httpRequest = context
          ? HttpClient.put(`/api/ui/admin/contexts/` + context, requestBody, getHeaders(tokenResult.accessToken))
          : HttpClient.post(`/api/ui/admin/contexts`, requestBody, getHeaders(tokenResult.accessToken))

        httpRequest.then((response) => {
          updateContextsCallback(response.data?.data as Context[])
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
        context: t('formValidation:exists')
      })
    } else if (error.response.status === 404) {
      setFormErrors({
        context: t('formValidation:notExists')
      })
    } else {
      setFormErrors({
        context: error.message as string
      })
    }
    return Promise.reject(error)
  }

  const updateFormState = useCallback((newFormData: Map | null, newFormErrors: Map | null) => {
    if (newFormData) {
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
    const contextElement = document.querySelector('[id="context"]')
    if (contextElement && contextElement.getAttribute('listener') !== 'true') {
      contextElement.addEventListener('change', useGeneralListener)
    }

    return () => {
      contextElement?.removeEventListener('change', useGeneralListener)
    }
  }, [useGeneralListener])

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">
            {context ? t('admin:company.editContext', { context }) : t('admin:company.createContext')}
          </h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div
            id={'context'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '3rem' }}
            className={'input-wrapper'}
          >
            <FdsInputComponent
              clearable={true}
              name={'context'}
              label={t('admin:company.context')}
              value={formData.context ? (formData.context as string) : ''}
              message={(formErrors.context as string) || ''}
              error={!!formErrors.context}
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
              variant={FdsButtonVariant.danger}
              iconSize={FdsTokenSize2}
              onClick={saveContext}
              label={t('common:save')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default ContextFormModal
