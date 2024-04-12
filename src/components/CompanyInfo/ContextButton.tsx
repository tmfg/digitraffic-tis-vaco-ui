import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import ContextModal from './ContextModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { Context } from '../../types/Context'

interface ContextButtonProps {
  context: string | null
  businessId: string
  updateContextsCallback: (c: Context[]) => void
}

export const ContextButton = ({ context, businessId, updateContextsCallback }: ContextButtonProps) => {
  const { t } = useTranslation()
  const [isEditModalShow, setIsEditModalShow] = useState(false)

  return (
    <>
      <FdsButtonComponent
        onClick={() => {
          setIsEditModalShow(true)
        }}
        label={context ? t('common:edit') : t('admin:company.createContext')}
        icon={context ? 'pencil-line' : 'plus'}
        variant={context ? FdsButtonVariant.secondary : FdsButtonVariant.primary}
      />
      {isEditModalShow && (
        <ContextModal
          close={() => setIsEditModalShow(false)}
          context={context}
          businessId={businessId}
          updateContextsCallback={updateContextsCallback}
        />
      )}
    </>
  )
}
