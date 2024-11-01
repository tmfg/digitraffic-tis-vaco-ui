import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import SubscriptionFormModal from './SubscriptionFormModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'

interface SubscriptionButtonProps {
  // Whether null or node defines if the form is in create or edit mode:
  subscription: string | null
  businessId: string
  updateSubscriptionsCallback: (subscriber: string, accessToken: string | null) => void
}

export const SubscriptionButton = ({
  subscription,
  businessId,
  updateSubscriptionsCallback
}: SubscriptionButtonProps) => {
  const { t } = useTranslation()
  const [isModalShow, setIsModalShow] = useState(false)

  return (
    <>
      <FdsButtonComponent
        onClick={() => {
          setIsModalShow(true)
        }}
        label={subscription ? t('common:edit') : t('admin:company.subscriptions.actions.create')}
        icon={subscription ? 'pencil-line' : 'plus'}
        variant={subscription ? FdsButtonVariant.secondary : FdsButtonVariant.primary}
      />
      {isModalShow && (
        <SubscriptionFormModal
          close={() => setIsModalShow(false)}
          subscription={subscription}
          businessId={businessId}
          updateSubscriptionsCallback={updateSubscriptionsCallback}
          modalStateCallback={setIsModalShow}
        />
      )}
    </>
  )
}
