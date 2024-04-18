import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import ContextFormModal from './ContextFormModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { Context } from '../../types/Context'

interface ContextButtonProps {
  // Whether null or node defines if the form is in create or edit mode:
  context: string | null
  businessId: string
  updateContextsCallback: (c: Context[]) => void
}

export const ContextButton = ({ context, businessId, updateContextsCallback }: ContextButtonProps) => {
  const { t } = useTranslation()
  const [isModalShow, setIsModalShow] = useState(false)

  return (
    <>
      <FdsButtonComponent
        onClick={() => {
          setIsModalShow(true)
        }}
        label={context ? t('common:edit') : t('admin:company.createContext')}
        icon={context ? 'pencil-line' : 'plus'}
        variant={context ? FdsButtonVariant.secondary : FdsButtonVariant.primary}
      />
      {isModalShow && (
        <ContextFormModal
          close={() => setIsModalShow(false)}
          context={context}
          businessId={businessId}
          updateContextsCallback={updateContextsCallback}
          modalStateCallback={setIsModalShow}
        />
      )}
    </>
  )
}
