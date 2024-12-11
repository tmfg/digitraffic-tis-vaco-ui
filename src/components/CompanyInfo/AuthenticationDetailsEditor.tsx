import { useTranslation } from 'react-i18next'
import { AuthenticationDetails } from '../../types/Credential.ts'
import { FdsInputComponent } from '../fds/FdsInputComponent.ts'
import { Map } from '../../types/Map.ts'

interface AuthenticationDetailsEditorProps {

  formErrors: Map
  authenticationDetails?: AuthenticationDetails
  type: string

}

export const AuthenticationDetailsEditor = ({ type, authenticationDetails, formErrors }: AuthenticationDetailsEditorProps) => {
  const { t } = useTranslation()

  if (type == 'HTTP Basic') {
    const httpBasic = authenticationDetails as Map

    return (
      <>
        <div
          id={'details_userId'}
          style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}
          className={'input-wrapper'}
        >
          <FdsInputComponent
            clearable={true}
            name={'details_userId'}
            label={t('admin:company.credentials.modal.userid')}
            value={httpBasic.details_userId ? (httpBasic.details_userId as string) : ''}
            message={(formErrors.details as string) || ''}
            error={!!formErrors.details}
          /></div>
          <div
            id={'details_password'}
            style={{ textAlign: 'left', width: '26rem', marginRight: '8rem', marginBottom: '1rem' }}
            className={'input-wrapper'}
          >
          <FdsInputComponent
            clearable={true}
            name={'details_password'}
            label={t('admin:company.credentials.modal.password')}
            value={httpBasic.details_password ? (httpBasic.details_password as string) : ''}
            message={(formErrors.details as string) || ''}
            error={!!formErrors.details}
          />
        </div>
      </>
    )
  } else {
    return <></>
  }
}
