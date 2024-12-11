import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FdsButtonComponent } from '../fds/FdsButtonComponent.ts'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button.ts'
import CredentialsFormModal from './CredentialsFormModal.tsx'
import { Credential } from '../../types/Credential.ts'
import { Company } from '../../types/Company.ts'

interface CredentialsButtonProps {

  credential?: Credential
  owner: Company
  updateCredentialsCallback: (owner: Company, accessToken: string | null) => void
}

export const CredentialsButton = ({ credential, owner, updateCredentialsCallback }: CredentialsButtonProps) => {
  const { t } = useTranslation()
  const [isModalShow, setIsModalShow] = useState(false)

  return (
    <>
      <FdsButtonComponent
        onClick={() => {
          setIsModalShow(true)
        }}
        label={credential ? t('common:edit') : t('admin:company.credentials.actions.create')}
        icon={credential ? 'pencil-line' : 'plus'}
        variant={credential ? FdsButtonVariant.secondary : FdsButtonVariant.primary}
      />
      {isModalShow && (
        <CredentialsFormModal
          mode={credential ? 'edit' : 'create'}
          close={() => setIsModalShow(false)}
          credential={credential}
          owner={owner}
          updateCredentialsCallback={updateCredentialsCallback}
          modalStateCallback={setIsModalShow}
        />
      )}
    </>
  )
}
