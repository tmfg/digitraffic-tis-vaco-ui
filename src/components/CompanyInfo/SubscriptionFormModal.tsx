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
import { CreateSubscriptionRequest } from '../../types/Subscription'
import { useMsal } from '@azure/msal-react'

interface ModalProps {
  close: () => void
  subscription: string | null
  businessId: string
  updateSubscriptionsCallback: (subscriber: string, accessToken: string | null) => void
  modalStateCallback: (isOpen: boolean) => void
}

const SubscriptionFormModal = ({
  close,
  subscription,
  businessId,
  updateSubscriptionsCallback,
  modalStateCallback
}: ModalProps) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Map>(subscription ? { subscription } : {})
  const [formErrors, setFormErrors] = useState<Map>({})
  const { instance, inProgress } = useMsal()

  const saveSubscription = () => {
    if (!formData.subscription) {
      setFormErrors({
        subscription: t('formValidation:isRequired', { value: t('admin:company.subscription') })
      })
      return
    }
    if (subscription && formData.subscription === subscription) {
      modalStateCallback(false)
      return
    }
    acquireToken(instance, inProgress).then(
      (tokenResult) => {
        if (!tokenResult) {
          // TODO: At some point, show some error notification
          return
        }
        const requestBody: CreateSubscriptionRequest = {
          type: 'webhook',
          subscriber: businessId,
          resource: formData.subscription as string
        }
        const httpRequest = subscription
          ? HttpClient.put(`/api/v1/subscriptions`, requestBody, getHeaders(tokenResult.accessToken))
          : HttpClient.post(`/api/v1/subscriptions`, requestBody, getHeaders(tokenResult.accessToken))

        httpRequest.then((_response) => {
          updateSubscriptionsCallback(businessId, tokenResult.accessToken)
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
        subscription: t('formValidation:exists')
      })
    } else if (error.response.status === 404) {
      setFormErrors({
        subscription: t('formValidation:notExists')
      })
    } else {
      setFormErrors({
        subscription: error.message as string
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
    const subscriptionElement = document.querySelector('[id="subscription"]')
    if (subscriptionElement && subscriptionElement.getAttribute('listener') !== 'true') {
      subscriptionElement.addEventListener('change', useGeneralListener)
    }

    return () => {
      subscriptionElement?.removeEventListener('change', useGeneralListener)
    }
  }, [useGeneralListener])

  return (
    <div className="modal">
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('admin:company.subscriptions.modal.title')}</h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div
            id={'subscription'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '3rem' }}
            className={'input-wrapper'}
          >
            <FdsInputComponent
              clearable={true}
              name={'subscription'}
              label={t('admin:company.subscriptions.modal.infoText')}
              value={formData.subscription ? (formData.subscription as string) : ''}
              message={(formErrors.subscription as string) || ''}
              error={!!formErrors.subscription}
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
              onClick={saveSubscription}
              label={t('common:save')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default SubscriptionFormModal
