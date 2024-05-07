import { useCallback, useEffect } from 'react'
import { FdsInputComponent } from '../../../fds/FdsInputComponent'
import { FormSectionProps } from '../../types'
import { useTranslation } from 'react-i18next'
import { FdsInputChange } from '../../../../../coreui-components/src/fds-input'
import { generalListener } from '../../../../util/form'

interface NetexEnturValidatorProps extends FormSectionProps {
  ruleName: string
}

export const getNetexAdditionalInputs = (ruleName: string): FdsInputChange[] => {
  return [
    {
      name: ruleName + '-codespace',
      value: ''
    },
    {
      name: ruleName + '-ignorableNetexElements',
      value: ''
    },
    {
      name: ruleName + '-maximumErrors',
      value: ''
    },
    {
      name: ruleName + '-reportId',
      value: ''
    }
  ]
}

const NetexEnturValidator = ({ ruleName, formErrors, formData, formStateUpdateCallback }: NetexEnturValidatorProps) => {
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
    const ignorableNetexElementsElement = document.querySelector('[id="' + ruleName + '-ignorableNetexElements' + '"]')
    if (ignorableNetexElementsElement && ignorableNetexElementsElement.getAttribute('listener') !== 'true') {
      ignorableNetexElementsElement.addEventListener('change', useGeneralListener)
      netexInputs.push(ignorableNetexElementsElement)
    }
    const maximumErrorsElement = document.querySelector('[id="' + ruleName + '-maximumErrors' + '"]')
    if (maximumErrorsElement && maximumErrorsElement.getAttribute('listener') !== 'true') {
      maximumErrorsElement.addEventListener('change', useGeneralListener)
      netexInputs.push(maximumErrorsElement)
    }
    const reportIdElement = document.querySelector('[id="' + ruleName + '-reportId' + '"]')
    if (reportIdElement && reportIdElement.getAttribute('listener') !== 'true') {
      reportIdElement.addEventListener('change', useGeneralListener)
      netexInputs.push(reportIdElement)
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
        <FdsInputComponent
          name={ruleName + '-codespace'}
          label={t('services:testData:form:netex:codespace') + ' *'}
          message={(formErrors[ruleName + '-codespace'] as string) || ''}
          error={!!formErrors[ruleName + '-codespace']}
        />
      </div>
      <div id={ruleName + '-ignorableNetexElements'} className={'format-config-input-wrapper'}>
        <FdsInputComponent
          name={ruleName + '-ignorableNetexElements'}
          label={t('services:testData:form:netex:ignorableNetexElements')}
          message={t('services:testData:form:netex:ignorableNetexElementsMessage')}
        />
      </div>
      <div id={ruleName + '-maximumErrors'} className={'format-config-input-wrapper'}>
        <FdsInputComponent
          name={ruleName + '-maximumErrors'}
          label={t('services:testData:form:netex:maximumErrors')}
          type={'number'}
        />
      </div>
      <div id={ruleName + '-reportId'} className={'format-config-input-wrapper'}>
        <FdsInputComponent name={ruleName + '-reportId'} label={t('services:testData:form:netex:reportId')} />
      </div>
    </div>
  )
}

export default NetexEnturValidator
