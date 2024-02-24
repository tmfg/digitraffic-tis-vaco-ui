import React from 'react'
import './_formContainer.scss'
import { useTranslation } from 'react-i18next'
import { FdsButtonComponent } from '../../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../../coreui-components/src/fds-button'
import { FdsActionSheetComponent } from '../../fds/FdsActionSheetComponent'
import { FdsCardComponent } from '../../fds/FdsCardComponent'
import { FdsTokenSize2 } from '../../../../coreui-css/lib'
import { FdsCardElevation } from '../../../../coreui-components/src/fds-card'

interface FormContainerProps {
  titleKey: string
  children?: React.ReactNode
  cancelCallback: () => void
  submitCallback: () => void
}

const FormContainer = ({ titleKey, children, cancelCallback, submitCallback }: FormContainerProps) => {
  const { t } = useTranslation()
  return (
    <FdsCardComponent elevation={FdsCardElevation.low} style={{ minWidth: '38rem', width: '30%', marginTop: '2.5rem' }}>
      <div slot="header" style={{ backgroundColor: 'black', color: 'white', padding: '8px' }}>
        {t(titleKey)}
      </div>

      {children}

      <footer
        slot={'footer'}
        style={{ backgroundColor: 'rgba(205, 205, 215, 0.2)', padding: '16px', borderTop: '1px solid black' }}
      >
        <FdsActionSheetComponent>
          <FdsButtonComponent
            onClick={cancelCallback}
            slot="separated"
            icon="x"
            iconSize={FdsTokenSize2}
            variant={FdsButtonVariant.secondary}
            label={t('common:cancel')}
          />
          <FdsButtonComponent icon="check" iconSize={FdsTokenSize2} onClick={submitCallback} label={t('common:save')} />
        </FdsActionSheetComponent>
      </footer>
    </FdsCardComponent>
  )
}

export default FormContainer
