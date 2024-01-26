import { Map } from '../../types/Map'
import { acquireToken } from '../../hooks/auth'
import { EntryRequest } from './types'
import { getHeaders, HttpClient } from '../../HttpClient'
import { EntryResource } from '../../types/EntryResource'
import { InteractionStatus, IPublicClientApplication } from '@azure/msal-browser'
import { TFunction } from 'i18next'
import { RulesetResource } from '../../types/Ruleset'
import { isUrl } from '../../util/url'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'

export const validateFormData = (
  formData: Map,
  translate: TFunction<'translation', undefined>,
  selectedRules: RulesetResource[]
) => {
  const errors: Map = {}

  if (!formData.url) {
    errors.url = translate('formValidation:isRequired', { value: 'URL' })
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

export const submitData = async (
  instance: IPublicClientApplication,
  inProgress: InteractionStatus,
  formData: Map,
  setFormErrors: (err: Map) => void,
  setEntryResource: (entry: EntryResource) => void,
  setIsModalOpen: (status: boolean) => void,
  translate: TFunction<'translation', undefined>,
  rules: RulesetResource[],
  email?: string | null
) => {
  const tokenResult = await acquireToken(instance, inProgress)
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
    const parts = (formData.url as string).split('/').filter((part) => !!part)
    formData.feedName = parts[parts.length - 1]
  }

  const validations = selectedRules.map((rule) => {
    if ((formData.format as string)?.toLowerCase() === 'netex') {
      return {
        name: rule.data.identifyingName,
        config: {
          codespace: formData[rule.data.identifyingName + '-codespace'],
          ignorableNetexElements: (formData[rule.data.identifyingName + '-ignorableNetexElements'] as string)
            ?.split(',')
            .filter((elem) => elem),
          maximumErrors: Number(formData[rule.data.identifyingName + '-maximumErrors']) || 500,
          reportId: formData[rule.data.identifyingName + '-reportId']
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
    format: (formData.format as string).toLowerCase(),
    businessId: formData.businessId as string,
    etag: formData.etag as string,
    validations: validations
  }

  if (email) {
    requestBody.notifications = [email]
  }

  const { data } = await HttpClient.post('/api/ui/queue', requestBody, getHeaders(tokenResult.accessToken))
  setEntryResource(data as EntryResource)
  setIsModalOpen(true)
}

export const getFeedNameSuggestion = (url: string) => {
  const parts = url.split('/').filter((part) => !!part)
  return parts[parts.length - 1]
}

export const getNewFormState = (formData: Map, inputChange: FdsInputChange) => {
  const newFormData: Map = {
    ...formData
  }
  newFormData[inputChange.name] = inputChange.value
  return newFormData
}

export const getNewFormStateAfterMultipleChanges = (formData: Map, inputsToChange: FdsInputChange[]) => {
  const newFormData: Map = {
    ...formData
  }

  inputsToChange.forEach((inputChange) => {
    newFormData[inputChange.name] = inputChange.value
  })

  return newFormData
}

export const getNewFormErrorsState = (formErrors: Map, inputChange: FdsInputChange) => {
  if (formErrors[inputChange.name]) {
    const newFormErrors = { ...formErrors }
    newFormErrors[inputChange.name] = undefined
    return newFormErrors
  }
  return formErrors
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
