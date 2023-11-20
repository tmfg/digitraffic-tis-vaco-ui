import { Map } from '../../types/Map'
import { acquireToken } from '../../hooks/auth'
import { EntryRequest } from './types'
import { getHeaders, HttpClient } from '../../HttpClient'
import { EntryResource } from '../../types/EntryResource'
import { IPublicClientApplication } from '@azure/msal-browser'
import { TFunction } from 'i18next'
import { RulesetResource } from '../../types/Ruleset'

export const validateFormData = (
  formData: Map,
  translate: TFunction<'translation', undefined>,
  selectedRules: RulesetResource[]
) => {
  const errors: Map = {}

  if (!formData.url) {
    errors.url = translate('formValidation:isRequired', { value: 'URL' })
  } else {
    try {
      new URL(formData.url as string)
    } catch (err) {
      errors.url = translate('formValidation:isInvalid', { value: 'URL' })
    }
  }

  if (!formData.format) {
    errors.format = translate('formValidation:isRequired', {
      value: translate('services:testData:form:format').toLowerCase()
    })
  }

  if (formData.format && selectedRules.length === 0) {
    errors.rules = translate('services:testData:form:rulesRequired')
  }

  if (formData.format === 'NETEX') {
    selectedRules.forEach((rule) => {
      if (!formData[rule.data.identifyingName + '-codespace']) {
        errors[rule.data.identifyingName + '-codespace'] = translate('formValidation:isRequired', {
          value: translate('services:testData:form:netex:codespace').toLowerCase()
        })
      }
    })
  }

  return errors
}

export const submitData = async (
  instance: IPublicClientApplication,
  formData: Map,
  setFormErrors: (err: Map) => void,
  setEntryResource: (err: EntryResource) => void,
  setIsModalOpen: (status: boolean) => void,
  translate: TFunction<'translation', undefined>,
  rules: RulesetResource[]
) => {
  const tokenResult = await acquireToken(instance)
  if (!tokenResult) {
    // TODO: At some point, show some error notification
    return
  }

  const selectedRules = rules.filter((rule) => formData[rule.data.identifyingName])
  const errors = validateFormData(formData, translate, selectedRules)
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    return
  }

  if (!formData.feedName) {
    const parts = (formData.url as string).split('/')
    formData.feedName = parts[parts.length - 1]
  }

  const validations = selectedRules.map((rule) => {
    if (formData.format === 'NETEX') {
      return {
        name: rule.data.identifyingName,
        config: {
          codespace: formData[rule.data.identifyingName + '-codespace'],
          ignorableNetexElements: (formData[rule.data.identifyingName + '-ignorableNetexElements'] as string)
            ?.split(',')
            .filter((elem) => elem),
          maximumErrors: formData[rule.data.identifyingName + '-maximumErrors'] || 500,
          reportId: formData[rule.data.identifyingName + '-formData']
        }
      }
    }

    return {
      name: rule.data.identifyingName,
      config: null
    }
  })

  const requestBody: EntryRequest = {
    url: formData.url as string,
    name: formData.feedName as string,
    format: formData.format as string,
    businessId: '2942108-7',
    etag: formData.etag as string,
    validations: validations
  }

  const { data } = await HttpClient.post('/api/queue', requestBody, getHeaders(tokenResult.accessToken))
  setEntryResource(data as EntryResource)
  setIsModalOpen(true)
}
