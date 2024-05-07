import { useCallback, useEffect } from 'react'
import { FdsInputChange } from '../../../../coreui-components/src/fds-input'
import {
  getNewFormErrorsState,
  getNewFormErrorsStateAfterMultipleChanges,
  getNewFormState,
  getNewFormStateAfterMultipleChanges
} from '../../../util/form'
import { FdsCheckboxComponent } from '../../fds/FdsCheckboxComponent'
import { FormSectionProps } from '../types'
import { Netex2GtfsEnturConverterName, NetexEnturValidatorName, RulesetResource } from '../../../types/Ruleset'
import { useTranslation } from 'react-i18next'
import NetexEnturValidator, { getNetexAdditionalInputs } from './ruleConfiguration/NetexEnturValidator'
import NetexEnturConverter, { getNetexConverterAdditionalInputs } from './ruleConfiguration/NetexEnturConverter'

interface RulesProps extends FormSectionProps {
  validationRules: RulesetResource[]
  conversionRules: RulesetResource[]
}

const Rules = ({ formData, formErrors, formStateUpdateCallback, validationRules, conversionRules }: RulesProps) => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    // Clear up selected rules from formData if those no longer available due to user's changed format/businessId selections
    const previouslySelectedRules = Object.keys(formData).filter((key) => key.includes('rule-'))
    previouslySelectedRules.forEach((ruleName) => {
      if (
        formData[ruleName] &&
        validationRules.filter((newRule) => 'rule-' + newRule.data.identifyingName === ruleName).length === 0 &&
        conversionRules.filter((newRule) => 'rule-' + newRule.data.identifyingName === ruleName).length === 0
      ) {
        const ruleToClearOut: FdsInputChange = {
          name: ruleName,
          value: false
        }
        let inputsToClearOut: FdsInputChange[] = [ruleToClearOut]
        if (ruleName.toLowerCase().includes(NetexEnturValidatorName)) {
          inputsToClearOut = inputsToClearOut.concat(getNetexAdditionalInputs(ruleName.substring(5)))
        }
        if (ruleName.toLowerCase().includes(Netex2GtfsEnturConverterName)) {
          inputsToClearOut = inputsToClearOut.concat(getNetexConverterAdditionalInputs(ruleName.substring(5)))
        }

        const newFormData = getNewFormStateAfterMultipleChanges(formData, inputsToClearOut)
        formStateUpdateCallback(
          newFormData,
          getNewFormErrorsStateAfterMultipleChanges(formErrors, getNetexAdditionalInputs(ruleName.substring(5)))
        )
      }
    })
  }, [formData, formErrors, formStateUpdateCallback, validationRules, conversionRules])

  const useRuleListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      const newFormState = getNewFormState(formData, detail)
      const newFormErrors = getNewFormErrorsState(formErrors, detail)
      formStateUpdateCallback(newFormState, newFormErrors)
      if (formErrors.rulesRequired && detail.value) {
        const newFormErrors = { ...formErrors }
        newFormErrors.rulesRequired = undefined
        formStateUpdateCallback(null, newFormErrors)
      }
    },
    [formStateUpdateCallback, formData, formErrors]
  )

  useEffect(() => {
    const allRuleCheckboxes: Element[] = []
    validationRules.forEach((rule) => {
      const checkbox = document.querySelector('[id="' + rule.data.identifyingName + '"]')
      if (checkbox && checkbox.getAttribute('listener') !== 'true') {
        checkbox.addEventListener('check', useRuleListener)
        allRuleCheckboxes.push(checkbox)
      }
    })

    conversionRules.forEach((rule) => {
      const checkbox = document.querySelector('[id="' + rule.data.identifyingName + '"]')
      if (checkbox && checkbox.getAttribute('listener') !== 'true') {
        checkbox.addEventListener('check', useRuleListener)
        allRuleCheckboxes.push(checkbox)
      }
    })

    return () => {
      allRuleCheckboxes.forEach((checkbox) => {
        checkbox?.removeEventListener('check', useRuleListener)
      })
    }
  }, [formData, validationRules, conversionRules, useRuleListener])

  const getRuleConfigurationFields = (ruleName: string) => {
    if (ruleName.toLowerCase().startsWith(NetexEnturValidatorName)) {
      return (
        <NetexEnturValidator
          ruleName={ruleName}
          formData={formData}
          formErrors={formErrors}
          formStateUpdateCallback={formStateUpdateCallback}
        />
      )
    } else if (ruleName.toLowerCase().startsWith(Netex2GtfsEnturConverterName)) {
      return (
        <NetexEnturConverter
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
          <h5>{t('services:testData.form.section.validationRules')}</h5>

          {validationRules.map((rule) => {
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
        </div>
      ) : (
        ''
      )}

      {formData.format && conversionRules.length > 0 ? (
        <div className={'form-section'}>
          <h5>{t('services:testData:form:section:conversionRules')}</h5>

          {conversionRules.map((rule) => {
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
        </div>
      ) : (
        ''
      )}

      {formErrors.rulesRequired && <div className={'error'}>{formErrors.rulesRequired}</div>}
    </>
  )
}

export default Rules
