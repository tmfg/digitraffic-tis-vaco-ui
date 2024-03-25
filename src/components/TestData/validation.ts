import { Map } from '../../types/Map'
import { TFunction } from 'i18next'
import { RulesetResource } from '../../types/Ruleset'
import { isUrl } from '../../util/url'

export const validateFormData = (
  formData: Map,
  translate: TFunction<'translation', undefined>,
  selectedRules: RulesetResource[]
) => {
  const errors: Map = {}

  if (!formData.url) {
    errors.url = translate('formValidation:isRequired', { value: 'URL' })
  } else if (!(formData.url.toString().startsWith('http://') || formData.url.toString().startsWith('https://'))) {
    errors.url = translate('formValidation:isMissingScheme', { value: 'URL' })
  } else if (!isUrl(formData.url as string)) {
    errors.url = translate('formValidation:isInvalid', { value: 'URL' })
  }

  if (!formData.format) {
    errors.format = translate('services:testData:form:formatRequired')
  }

  if (!formData.businessId) {
    errors.businessId = translate('services:testData:form:companyRequired')
  }

  if (formData.format && selectedRules.length === 0) {
    errors.rules = translate('services:testData:form:rulesRequired')
  }

  if ((formData.format as string)?.toLowerCase() === 'netex') {
    selectedRules.forEach((rule) => {
      if (!formData[rule.data.identifyingName + '-codespace']) {
        errors[rule.data.identifyingName + '-codespace'] = translate('services:testData:form:netex:codespaceRequired')
      }
    })
  }

  return errors
}
