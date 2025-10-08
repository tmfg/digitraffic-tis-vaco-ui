import { FormSectionProps } from '../../types'
import { FdsInputChange } from '../../../../../coreui-components/src/fds-input'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import { generalListener } from '../../../../util/form'
import { FdsInputComponent } from '../../../fds/FdsInputComponent'
import { FdsCheckboxComponent } from '../../../fds/FdsCheckboxComponent.ts'

interface NetexEnturConverterProps extends FormSectionProps {
  ruleName: string
}

export const getNetexConverterAdditionalInputs = (ruleName: string): FdsInputChange[] => {
  return [
    {
      name: ruleName + '-codespace',
      value: ''
    },
    {
      name: ruleName + '-stopsOnly',
      value: false,
    }
  ]
}

const NetexEnturConverter = ({ ruleName, formErrors, formData, formStateUpdateCallback }: NetexEnturConverterProps) => {
  const { t } = useTranslation()

  const useGeneralListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      generalListener(e, formStateUpdateCallback, formData, formErrors)
    },
    [formStateUpdateCallback, formData, formErrors]
  )

  useEffect(() => {
    const netexInputs: Element[] = []
    const codespaceElement = document.querySelector('[id="' + ruleName + '-codespace' + '"]')
    if (codespaceElement && codespaceElement.getAttribute('listener') !== 'true') {
      codespaceElement.addEventListener('change', useGeneralListener)
      netexInputs.push(codespaceElement)
    }

    const stopsOnlyElement = document.querySelector('[id="' + ruleName + '-stopsOnly' + '"]')
    if (stopsOnlyElement && stopsOnlyElement.getAttribute('listener') !== 'true') {
      stopsOnlyElement.addEventListener('change', useGeneralListener)
      netexInputs.push(stopsOnlyElement)
    }

    return () => {
      netexInputs.forEach((input) => {
        input?.removeEventListener('change', useGeneralListener)
      })
    }
  }, [ruleName, useGeneralListener])

  return (
    <div className={'format-config-wrapper'}>
      <div id={ruleName + '-codespace'} className={'format-config-input-wrapper'}>
        <div className="input-wrapper">
          <FdsInputComponent
            name={ruleName + '-codespace'}
            label={t('services:testData:form:netex:codespace') + ' *'}
            message={(formErrors[ruleName + '-codespace'] as string) || ''}
            error={!!formErrors[ruleName + '-codespace']}
          />
        </div>
        <div className="input-wrapper">
          <FdsCheckboxComponent
            name={ruleName + '-stopsOnly'}
            label={t('services:testData:form:rules:netex2gtfs:stopsOnly')}
          />
        </div>
      </div>
    </div>
  )
}

export default NetexEnturConverter
