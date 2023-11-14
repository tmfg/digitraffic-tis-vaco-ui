import './_form.scss'
import { FdsAlertComponent } from '../fds/FdsAlertComponent'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { FdsCheckboxComponent } from '../fds/FdsCheckboxComponent'
import { FdsDropdownComponent } from '../fds/FdsDropdownComponent'
import { useCallback, useEffect, useState } from 'react'
import { EntryResource } from '../../types/EntryResource'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { acquireToken } from '../../hooks/auth'

import { getHeaders, HttpClient } from '../../HttpClient'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsDropdownOption } from '../../../coreui-components/src/fds-dropdown'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import DataSubmittedModal from './DataSubmittedModal'
import { useNavigate } from 'react-router-dom'
import { RulesetResource } from '../../types/Ruleset'
import { Map } from '../../types/Map'
import { submitData } from './formActions'

const Form = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const { instance } = useMsal()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Map>({})
  const formats: FdsDropdownOption<string>[] = [
    { label: 'GTFS', value: 'GTFS' },
    { label: 'NeTEx', value: 'NETEX' }
  ]
  const [rules, setRules] = useState<RulesetResource[]>([])
  const [formErrors, setFormErrors] = useState<Map>({})
  const [feedNamePlaceholder, setFeedNamePlaceholder] = useState<string>(
    t('services:testData:form:feedNamePlaceHolder')
  )
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const navigateToProcessingResult = () => {
    navigate('/data/' + entryResource?.data.publicId)
  }

  const updateFormState = useCallback(
    (detail: FdsInputChange) => {
      const newFormData: Map = {
        ...formData
      }
      newFormData[detail.name] = detail.value

      if (formErrors[detail.name] && detail.value) {
        const newFormErrors = { ...formErrors }
        newFormErrors[detail.name] = undefined
        setFormErrors(newFormErrors)
      }

      setFormData(newFormData)
    },
    [formData, formErrors]
  )

  const useFormatListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      updateFormState(detail)
      acquireToken(instance).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }

          HttpClient.get('/api/rules?businessId=2942108-7', getHeaders(tokenResult.accessToken)).then(
            (response) => {
              const rules = response.data as RulesetResource[]
              setRules(rules.filter((rule) => rule.data.format.toUpperCase() === detail.value))
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
    [instance, updateFormState]
  )

  const useUrlListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      updateFormState(detail)

      // Populating feedName placeholder if there nothing specified by user:
      if (formData.feedName) {
        return
      }

      if (detail.value) {
        const parts = (detail.value as string).split('/').filter((part) => !!part)
        setFeedNamePlaceholder(parts[parts.length - 1])
      } else {
        setFeedNamePlaceholder(t('services:testData:form:feedNamePlaceHolder'))
      }
    },
    [formData, feedNamePlaceholder, updateFormState, t]
  )

  const useRuleListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      updateFormState(detail)
      if (formErrors.rules && detail.value) {
        const newFormErrors = { ...formErrors }
        newFormErrors.rules = undefined
        setFormErrors(newFormErrors)
      }
    },
    [updateFormState]
  )

  const useGeneralListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      updateFormState(detail)
    },
    [updateFormState]
  )

  useEffect(() => {
    // Thanks to the web components' shadow root, no easy way to get these elements narrowed down by input name
    const feedNameElement = document.getElementsByTagName('fds-input')[0]
    if (feedNameElement && feedNameElement.getAttribute('listener') !== 'true') {
      feedNameElement.addEventListener('change', useGeneralListener)
    }
    const urlElement = document.getElementsByTagName('fds-input')[1]
    if (urlElement && urlElement.getAttribute('listener') !== 'true') {
      urlElement.addEventListener('change', useUrlListener)
    }
    const etagElement = document.getElementsByTagName('fds-input')[2]
    if (etagElement && etagElement.getAttribute('listener') !== 'true') {
      etagElement.addEventListener('change', useGeneralListener)
    }
    const formatElement = document.getElementsByTagName('fds-dropdown')[0]
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

    const previousInputs = 3
    const netexInputs: Element[] = []
    rules.map((rule, i) => {
      const checkbox = document.getElementsByTagName('fds-checkbox')[i]
      console.log(i, rule)
      console.log(checkbox)
      if (checkbox && checkbox.getAttribute('listener') !== 'true') {
        checkbox.addEventListener('check', useRuleListener)
      }

      if (formData.format === 'NETEX') {
        const codespaceElement = document.getElementsByTagName('fds-input')[previousInputs + i * 4]
        if (codespaceElement && codespaceElement.getAttribute('listener') !== 'true') {
          codespaceElement.addEventListener('change', useGeneralListener)
          netexInputs.push(codespaceElement)
        }
        const ignorableNetexElementsElement = document.getElementsByTagName('fds-input')[previousInputs + 1 + i * 4]
        if (ignorableNetexElementsElement && ignorableNetexElementsElement.getAttribute('listener') !== 'true') {
          ignorableNetexElementsElement.addEventListener('change', useUrlListener)
          netexInputs.push(ignorableNetexElementsElement)
        }
        const maximumErrorsElement = document.getElementsByTagName('fds-input')[previousInputs + 2 + i * 4]
        if (maximumErrorsElement && maximumErrorsElement.getAttribute('listener') !== 'true') {
          maximumErrorsElement.addEventListener('change', useGeneralListener)
          netexInputs.push(maximumErrorsElement)
        }
        const reportIdElement = document.getElementsByTagName('fds-input')[previousInputs + 3 + i * 4]
        if (reportIdElement && reportIdElement.getAttribute('listener') !== 'true') {
          reportIdElement.addEventListener('change', useGeneralListener)
          netexInputs.push(reportIdElement)
        }
      }
    })

    return () => {
      let i = 0
      rules.forEach(() => {
        const checkbox = document.getElementsByTagName('fds-checkbox')[i]
        checkbox?.removeEventListener('check', useRuleListener)
        i++
      })
      netexInputs.forEach((input) => {
        input?.removeEventListener('select', useGeneralListener)
      })
    }
  }, [formData, rules, useGeneralListener])

  return (
    <>
      {entryResource && isModalOpen && <DataSubmittedModal close={closeModal} proceed={navigateToProcessingResult} />}
      <h3>{t('services:testData:form:title')}</h3>
      <form>
        <div className={'form-section'}>
          <h5>{t('services:testData:form:section:basic')}</h5>

          <div className={'input-wrapper'}>
            <FdsInputComponent
              name={'feedName'}
              placeholder={feedNamePlaceholder || t('services:testData:form:feedNamePlaceHolder')}
              label={t('services:testData:form:feedName')}
              message={t('services:testData:form:feedNameInfo')}
            />
          </div>

          <div className={'input-wrapper'}>
            <FdsInputComponent
              name={'url'}
              placeholder={'https://'}
              label={t('services:testData:form:url') + ' *'}
              message={(formErrors['url'] as string) || t('services:testData:form:urlInfo')}
              error={!!formErrors['url']}
            />
          </div>

          <div className={'input-wrapper etag'}>
            <FdsInputComponent name={'etag'} label={t('services:testData:form:etag')} />
          </div>

          <div className={'input-wrapper format'}>
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
            <h5>{t('services:testData:form:section:rules')}</h5>

            {rules.map((rule) => {
              return (
                <div key={rule.data.identifyingName}>
                  <FdsCheckboxComponent name={rule.data.identifyingName} label={rule.data.description} />

                  {/* In future these per-format additional fields will come from API */}
                  {rule.data.identifyingName.toLowerCase().includes('netex') && formData[rule.data.identifyingName] && (
                    <div className={'format-config-wrapper'}>
                      <div className={'format-config-input-wrapper'}>
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-codespace'}
                          label={t('services:testData:form:netex:codespace') + ' *'}
                          message={(formErrors[rule.data.identifyingName + '-codespace'] as string) || ''}
                          error={!!formErrors[rule.data.identifyingName + '-codespace']}
                        />
                      </div>
                      <div className={'format-config-input-wrapper'}>
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-ignorableNetexElements'}
                          label={t('services:testData:form:netex:ignorableNetexElements')}
                          message={t('services:testData:form:netex:ignorableNetexElementsMessage')}
                        />
                      </div>
                      <div className={'format-config-input-wrapper'}>
                        <FdsInputComponent
                          name={rule.data.identifyingName + '-maximumErrors'}
                          label={t('services:testData:form:netex:maximumErrors')}
                          type={'number'}
                        />
                      </div>
                      <div className={'format-config-input-wrapper'}>
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
            <div className={'form-section'}>
              <FdsAlertComponent icon={'alert-circle'}>{t('services:testData:form:error')}</FdsAlertComponent>
            </div>
          )}

        <div className={'form-section'}>
          <FdsButtonComponent
            onClick={(e) => {
              submitData(e, instance, formData, setFormErrors, setEntryResource, setIsModalOpen, t, rules).catch(
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
