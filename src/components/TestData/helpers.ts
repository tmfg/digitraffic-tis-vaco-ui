import { Map } from '../../types/Map'
import { acquireToken } from '../../hooks/auth'
import { EntryRequest } from './types'
import { getHeaders, HttpClient } from '../../HttpClient'
import { EntryResource } from '../../types/EntryResource'
import { InteractionStatus, IPublicClientApplication } from '@azure/msal-browser'
import { TFunction } from 'i18next'
import { RulesetResource, RulesetType } from '../../types/Ruleset'
import { validateFormData } from './validation'

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

  const selectedRules = rules.filter((rule) => formData['rule-' + rule.data.identifyingName])
  const errors = validateFormData(formData, translate, selectedRules)
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    return
  }

  if (!formData.feedName) {
    const parts = (formData.url as string).split('/').filter((part) => !!part)
    formData.feedName = parts[parts.length - 1]
  }

  const validations = selectedRules
    .filter((rule) => rule.data.type === RulesetType.ValidationSyntax)
    .map((rule) => {
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

  const conversions = selectedRules
    .filter((rule) => rule.data.type === RulesetType.ConversionSyntax)
    .map((rule) => {
      // Could have been rule name-specific check, but then it's cumbersome when dealing with versioned legacy rules
      if ((formData.format as string)?.toLowerCase() === 'netex') {
        return {
          name: rule.data.identifyingName,
          config: {
            codespace: formData[rule.data.identifyingName + '-codespace']
          }
        }
      }

      return {
        name: rule.data.identifyingName,
        config: null
      }
    })

  const requestBody: EntryRequest = {
    name: formData.feedName as string,
    businessId: formData.businessId as string,
    url: formData.url as string,
    context: formData.context as string,
    etag: formData.etag as string,
    format: (formData.format as string).toLowerCase(),
    validations,
    conversions
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
