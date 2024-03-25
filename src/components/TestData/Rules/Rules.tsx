import { useCallback, useEffect } from 'react'
import { FdsInputChange } from '../../../../coreui-components/src/fds-input'
import {
  getNewFormErrorsState,
  getNewFormErrorsStateAfterMultipleChanges,
  getNewFormState,
  getNewFormStateAfterMultipleChanges /*, getNewFormStateAfterMultipleChanges*/
} from '../../../util/form'
import { FdsCheckboxComponent } from '../../fds/FdsCheckboxComponent'
import { FormComponentProps } from '../types'
import { RulesetResource } from '../../../types/Ruleset'
import { useTranslation } from 'react-i18next'
import NetexEntur, { getNetexAdditionalInputs } from './ruleConfiguration/NetexEntur'

interface RulesProps extends FormComponentProps {
  rules: RulesetResource[]
}

const Rules = ({ formData, formErrors, formStateUpdateCallback, rules }: RulesProps) => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    // Clear up selected rules from formData if those no longer available due to user's changed format/businessId selections
    const previouslySelectedRules = Object.keys(formData).filter((key) => key.includes('rule-'))
    previouslySelectedRules.forEach((ruleName) => {
      if (
        formData[ruleName] &&
        rules.filter((newRule) => 'rule-' + newRule.data.identifyingName === ruleName).length === 0
      ) {
        const ruleToClearOut: FdsInputChange = {
          name: ruleName,
          value: false
        }
        let inputsToClearOut: FdsInputChange[] = [ruleToClearOut]
        if (ruleName.toLowerCase().includes('netex')) {
          inputsToClearOut = inputsToClearOut.concat(getNetexAdditionalInputs(ruleName.substring(5)))
        }

        const newFormData = getNewFormStateAfterMultipleChanges(formData, inputsToClearOut)
        formStateUpdateCallback(
          newFormData,
          getNewFormErrorsStateAfterMultipleChanges(formErrors, getNetexAdditionalInputs(ruleName.substring(5)))
        )
      }
    })
  }, [formData, formErrors, formStateUpdateCallback, rules])

  const useRuleListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      const newFormState = getNewFormState(formData, detail)
      const newFormErrors = getNewFormErrorsState(formErrors, detail)
      formStateUpdateCallback(newFormState, newFormErrors)
      if (formErrors.rules && detail.value) {
        const newFormErrors = { ...formErrors }
        newFormErrors.rules = undefined
        formStateUpdateCallback(null, newFormErrors)
      }
    },
    [formStateUpdateCallback, formData, formErrors]
  )

  useEffect(() => {
    const ruleCheckboxes: Element[] = []
    rules.forEach((rule) => {
      const checkbox = document.querySelector('[id="' + rule.data.identifyingName + '"]')
      if (checkbox && checkbox.getAttribute('listener') !== 'true') {
        checkbox.addEventListener('check', useRuleListener)
        ruleCheckboxes.push(checkbox)
      }
    })

    return () => {
      ruleCheckboxes.forEach((checkbox) => {
        checkbox?.removeEventListener('check', useRuleListener)
      })
    }
  }, [formData, rules, useRuleListener])

  const getRuleConfigurationFields = (ruleName: string) => {
    if (ruleName.toLowerCase().includes('netex')) {
      return (
        <NetexEntur
          ruleName={ruleName}
          formData={formData}
          formErrors={formErrors}
          formStateUpdateCallback={formStateUpdateCallback}
        />
      )
    }
    return <></>
  }

  return (
    <>
      {formData.format ? (
        <div className={'form-section'}>
          <h5>{t('services:testData:form:section:rules')} *</h5>

          {rules.map((rule) => {
            return (
              <div id={rule.data.identifyingName} key={'rule-' + rule.data.identifyingName}>
                <FdsCheckboxComponent
                  name={'rule-' + rule.data.identifyingName}
                  label={
                    i18n.exists('services:testData:form:rules:' + rule.data.identifyingName)
                      ? t('services:testData:form:rules:' + rule.data.identifyingName)
                      : rule.data.description
                  }
                />
                {formData['rule-' + rule.data.identifyingName] && getRuleConfigurationFields(rule.data.identifyingName)}
              </div>
            )
          })}
          {formErrors.rules && <div className={'error'}>{formErrors.rules as string}</div>}
        </div>
      ) : (
        ''
      )}

      {formData.format && rules.length === 0 && (
        <div className={'error'}>{t('services:testData:form:noValidationRulesFound')}</div>
      )}
    </>
  )
}

export default Rules
