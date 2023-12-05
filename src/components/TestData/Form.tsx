import './_form.scss'
import { FdsAlertComponent } from '../fds/FdsAlertComponent'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { FdsCheckboxComponent } from '../fds/FdsCheckboxComponent'
import { FdsDropdownComponent } from '../fds/FdsDropdownComponent'
import { useCallback, useEffect, useState } from 'react'
import { EntryResource } from '../../types/EntryResource'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { acquireToken, isUserInTransition } from '../../hooks/auth'

import { getHeaders, HttpClient } from '../../HttpClient'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsDropdownOption } from '../../../coreui-components/src/fds-dropdown'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import DataSubmittedModal from './DataSubmittedModal'
import { useNavigate } from 'react-router-dom'
import { RulesetResource } from '../../types/Ruleset'
import { Map } from '../../types/Map'
import { getFeedNameSuggestion, getNewFormErrorsState, getNewFormState, submitData } from './helpers'

const Form = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const { instance, inProgress } = useMsal()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState<Map>({})
  const formats: FdsDropdownOption<string>[] = [
    { label: 'GTFS', value: 'GTFS' },
    { label: 'NeTEx', value: 'NETEX' }
  ]
  const [rules, setRules] = useState<RulesetResource[]>([])
  const [formErrors, setFormErrors] = useState<Map>({})
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const navigateToProcessingResult = () => {
    navigate('/data/' + entryResource?.data.publicId)
  }

  const updateFormState = useCallback((newFormData: Map, newFormErrors: Map) => {
    setFormData(newFormData)
    setFormErrors(newFormErrors)
  }, [])

  const useFormatListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      const newFormState = getNewFormState(formData, detail)
      const newFormErrors = getNewFormErrorsState(formErrors, detail)
      updateFormState(newFormState, newFormErrors)

      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }

          HttpClient.get('/api/rules?businessId=2942108-7', getHeaders(tokenResult.accessToken)).then(
            (response) => {
              const rules = response.data as RulesetResource[]
              setRules(
                rules.filter(
                  (rule) => rule.data.format.toUpperCase() === detail.value && rule.data.type.includes('VALIDATION')
                )
              )
            },
            (error) => {
              return Promise.reject(error)
            }
          )
        },
        (error) => {
          // Show some error
          return Promise.reject(error)
        }
      )
    },
    [instance, updateFormState, formData, formErrors]
  )

  const useUrlListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const previousUrl = formData.url
      const detail = (e as CustomEvent).detail as FdsInputChange
      let newFormData = getNewFormState(formData, detail)
      let newFormErrors = getNewFormErrorsState(formErrors, detail)

      // Populating feedName placeholder if there not customized by user:
      if (detail.value && !formData.feedName) {
        const newFeedName: FdsInputChange = {
          name: 'feedName',
          value: getFeedNameSuggestion(detail.value as string)
        }
        newFormData = getNewFormState(newFormData, newFeedName)
        newFormErrors = getNewFormErrorsState(newFormErrors, newFeedName)
      } else if (previousUrl && formData.feedName === getFeedNameSuggestion(previousUrl as string)) {
        const newFeedName: FdsInputChange = {
          name: 'feedName',
          value: detail.value ? getFeedNameSuggestion(detail.value as string) : ''
        }
        newFormData = getNewFormState(newFormData, newFeedName)
        newFormErrors = getNewFormErrorsState(newFormErrors, newFeedName)
      }

      updateFormState(newFormData, newFormErrors)
    },
    [formData, formErrors, updateFormState]
  )

  const useRuleListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      const newFormState = getNewFormState(formData, detail)
      const newFormErrors = getNewFormErrorsState(formErrors, detail)
      updateFormState(newFormState, newFormErrors)
      if (formErrors.rules && detail.value) {
        const newFormErrors = { ...formErrors }
        newFormErrors.rules = undefined
        setFormErrors(newFormErrors)
      }
    },
    [updateFormState, formData, formErrors]
  )

  const useGeneralListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      const newFormState = getNewFormState(formData, detail)
      const newFormErrors = getNewFormErrorsState(formErrors, detail)
      updateFormState(newFormState, newFormErrors)
    },
    [updateFormState, formData, formErrors]
  )

  useEffect(() => {
    if (!isUserInTransition(inProgress)) {
      const account = instance.getActiveAccount()
      if (account) {
        setEmail(account.username)
      }
    }
  }, [instance, inProgress])

  useEffect(() => {
    const feedNameElement = document.querySelector('[id="feedName"]')
    if (feedNameElement && feedNameElement.getAttribute('listener') !== 'true') {
      feedNameElement.addEventListener('change', useGeneralListener)
    }
    const urlElement = document.querySelector('[id="url"]')
    if (urlElement && urlElement.getAttribute('listener') !== 'true') {
      urlElement.addEventListener('change', useUrlListener)
    }
    const etagElement = document.querySelector('[id="etag"]')
    if (etagElement && etagElement.getAttribute('listener') !== 'true') {
      etagElement.addEventListener('change', useGeneralListener)
    }
    const formatElement = document.querySelector('[id="format"]')
    if (formatElement && formatElement.getAttribute('listener') !== 'true') {
      formatElement.addEventListener('select', useFormatListener)
    }

    return () => {
      feedNameElement?.removeEventListener('change', useGeneralListener)
      urlElement?.removeEventListener('change', useUrlListener)
      etagElement?.removeEventListener('change', useGeneralListener)
      formatElement?.removeEventListener('select', useFormatListener)
    }
  }, [useGeneralListener, useFormatListener, useUrlListener])

  useEffect(() => {
    if (!formData.format || !rules || rules.length === 0) {
      return
    }

    const ruleCheckboxes: Element[] = []
    const netexInputs: Element[] = []
    rules.forEach((rule) => {
      const checkbox = document.querySelector('[id="' + rule.data.identifyingName + '"]')
      if (checkbox && checkbox.getAttribute('listener') !== 'true') {
        checkbox.addEventListener('check', useRuleListener)
        ruleCheckboxes.push(checkbox)
      }

      if (formData.format === 'NETEX') {
        const codespaceElement = document.querySelector('[id="' + rule.data.identifyingName + '-codespace' + '"]')
        if (codespaceElement && codespaceElement.getAttribute('listener') !== 'true') {
          codespaceElement.addEventListener('change', useGeneralListener)
          netexInputs.push(codespaceElement)
        }
        const ignorableNetexElementsElement = document.querySelector(
          '[id="' + rule.data.identifyingName + '-ignorableNetexElements' + '"]'
        )
        if (ignorableNetexElementsElement && ignorableNetexElementsElement.getAttribute('listener') !== 'true') {
          ignorableNetexElementsElement.addEventListener('change', useUrlListener)
          netexInputs.push(ignorableNetexElementsElement)
        }
        const maximumErrorsElement = document.querySelector(
          '[id="' + rule.data.identifyingName + '-maximumErrors' + '"]'
        )
        if (maximumErrorsElement && maximumErrorsElement.getAttribute('listener') !== 'true') {
          maximumErrorsElement.addEventListener('change', useGeneralListener)
          netexInputs.push(maximumErrorsElement)
        }
        const reportIdElement = document.querySelector('[id="' + rule.data.identifyingName + '-reportId' + '"]')
        if (reportIdElement && reportIdElement.getAttribute('listener') !== 'true') {
          reportIdElement.addEventListener('change', useGeneralListener)
          netexInputs.push(reportIdElement)
        }
      }
    })

    return () => {
      ruleCheckboxes.forEach((checkbox) => {
        checkbox?.removeEventListener('check', useRuleListener)
      })
      netexInputs.forEach((input) => {
        input?.removeEventListener('select', useGeneralListener)
      })
    }
  }, [formData, rules, useGeneralListener, useRuleListener, useUrlListener])

  return (
    <>
      {entryResource && isModalOpen && (
        <DataSubmittedModal
          publicId={entryResource.data.publicId}
          email={email}
          close={closeModal}
          proceed={navigateToProcessingResult}
        />
      )}
      <h3>{t('services:testData:form:title')}</h3>
      <form>
        <div className={'form-section'}>
          <h5>{t('services:testData:form:section:basic')}</h5>

          <div id={'feedName'} className={'input-wrapper'}>
            <FdsInputComponent
              clearable={true}
              name={'feedName'}
              placeholder={t('services:testData:form:feedNamePlaceHolder')}
              label={t('services:testData:form:feedName')}
              message={t('services:testData:form:feedNameInfo')}
              value={formData.feedName ? (formData.feedName as string) : ''}
            />
          </div>

          <div id={'url'} className={'input-wrapper'}>
            <FdsInputComponent
              clearable={true}
              name={'url'}
              placeholder={'https://'}
              label={t('services:testData:form:url') + ' *'}
              message={(formErrors['url'] as string) || t('services:testData:form:urlInfo')}
              error={!!formErrors['url']}
            />
          </div>

          <div id={'etag'} className={'input-wrapper etag'}>
            <FdsInputComponent clearable={true} name={'etag'} label={t('services:testData:form:etag')} />
          </div>

          <div id={'format'} className={'input-wrapper format'}>
            <FdsDropdownComponent
              name={'format'}
              label={t('services:testData:form:format') + ' *'}
              options={formats}
              message={(formErrors['format'] as string) || ''}
              error={!!formErrors['format']}
            />
          </div>
        </div>

        {rules && rules.length > 0 && (
          <div className={'form-section'}>
            <h5>{t('services:testData:form:section:rules')} *</h5>

            {rules.map((rule) => {
              return (
                <div id={rule.data.identifyingName} key={'rule-' + rule.data.identifyingName}>
                  <FdsCheckboxComponent
                    name={rule.data.identifyingName}
                    label={
                      i18n.exists('services:testData:form:rules:' + rule.data.identifyingName)
                        ? t('services:testData:form:rules:' + rule.data.identifyingName)
                        : rule.data.description
                    }
                  />

                  {/* In future these per-format additional fields will come from API */}
                  {rule.data.identifyingName.toLowerCase().includes('netex') && formData[rule.data.identifyingName] && (
                    <div className={'format-config-wrapper'}>
                      <div id={rule.data.identifyingName + '-codespace'} className={'format-config-input-wrapper'}>
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-codespace'}
                          label={t('services:testData:form:netex:codespace') + ' *'}
                          message={(formErrors[rule.data.identifyingName + '-codespace'] as string) || ''}
                          error={!!formErrors[rule.data.identifyingName + '-codespace']}
                        />
                      </div>
                      <div
                        id={rule.data.identifyingName + '-ignorableNetexElements'}
                        className={'format-config-input-wrapper'}
                      >
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-ignorableNetexElements'}
                          label={t('services:testData:form:netex:ignorableNetexElements')}
                          message={t('services:testData:form:netex:ignorableNetexElementsMessage')}
                        />
                      </div>
                      <div id={rule.data.identifyingName + '-maximumErrors'} className={'format-config-input-wrapper'}>
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-maximumErrors'}
                          label={t('services:testData:form:netex:maximumErrors')}
                          type={'number'}
                        />
                      </div>
                      <div id={rule.data.identifyingName + '-reportId'} className={'format-config-input-wrapper'}>
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-reportId'}
                          label={t('services:testData:form:netex:reportId')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {formErrors.rules && <div className={'error'}>{formErrors.rules}</div>}
          </div>
        )}

        {formErrors &&
          (formErrors.url ||
            formErrors.format ||
            formErrors.rules ||
            (formData.format === 'NETEX' &&
              rules.filter((rule) => formErrors[rule.data.identifyingName + '-codespace']).length > 0)) && (
            <div data-testid="error-alert" className={'form-section'}>
              <FdsAlertComponent icon={'alert-circle'}>{t('services:testData:form:error')}</FdsAlertComponent>
            </div>
          )}

        <div className={'form-section'}>
          <FdsButtonComponent
            onClick={(e) => {
              e.preventDefault()
              submitData(
                instance,
                inProgress,
                formData,
                setFormErrors,
                setEntryResource,
                setIsModalOpen,
                t,
                rules
              ).catch(
                (err) => console.log('Data submission error', err)
                // TODO: show some alert
              )
            }}
            label={t('services:testData:form:submit')}
          />
        </div>
      </form>
    </>
  )
}

export default Form
