import { AppContext, AppContextType } from '../../../AppContextProvider'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { FdsDropdownOption } from '../../../../coreui-components/src/fds-dropdown'
import { FdsInputChange } from '../../../../coreui-components/src/fds-input'
import { generalListener, getNewFormErrorsState, getNewFormState } from '../../../util/form'
import { getFeedNameSuggestion } from '../helpers'
import { FdsDropdownComponent } from '../../fds/FdsDropdownComponent'
import { FdsInputComponent } from '../../fds/FdsInputComponent'
import { useTranslation } from 'react-i18next'
import { FormComponentProps } from '../types'

interface BasicInformationProps extends FormComponentProps {
  formats: string[]
  isFetchInProgress: boolean
}

const BasicInformation = ({
  formData,
  formErrors,
  formStateUpdateCallback,
  formats,
  isFetchInProgress
}: BasicInformationProps) => {
  const { t, i18n } = useTranslation()
  const appContext: AppContextType = useContext(AppContext)
  const companyOptions: FdsDropdownOption<string>[] = useMemo(() => {
    return appContext?.companies
      ? appContext.companies.map((company) => {
          return {
            label: `${company.name} (${company.businessId})`,
            value: company.businessId
          }
        })
      : []
  }, [appContext.companies])
  const formatOptions: FdsDropdownOption<string>[] = formats.map((format: string) => {
    return {
      label: i18n.exists('format:' + format.toLowerCase()) ? t('format:' + format.toLowerCase()) : format,
      value: format
    }
  })

  useEffect(() => {
    // Set default selected company if there is only one option
    if (companyOptions.length === 1 && !formData.businessId) {
      const newFormData = {
        ...formData,
        businessId: companyOptions[0].value
      }
      formStateUpdateCallback(newFormData, null)
    }
  }, [companyOptions, formData, formStateUpdateCallback])

  useEffect(() => {
    // When user selects new company, resetting format if it's no longer available for the new company
    if (formData.format && formats.filter((f) => f === formData.format).length == 0) {
      const newFormData = {
        ...formData,
        format: undefined
      }
      const newFormErrors = {
        ...formErrors,
        format: undefined
      }
      formStateUpdateCallback(newFormData, newFormErrors)
    }
  }, [formData, formErrors, formStateUpdateCallback, formats])

  const useGeneralListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      generalListener(e, formStateUpdateCallback, formData, formErrors)
    },
    [formStateUpdateCallback, formData, formErrors]
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

      formStateUpdateCallback(newFormData, newFormErrors)
    },
    [formData, formErrors, formStateUpdateCallback]
  )

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
    const contextElement = document.querySelector('[id="context"]')
    if (contextElement && contextElement.getAttribute('listener') !== 'true') {
      contextElement.addEventListener('change', useGeneralListener)
    }
    const companyElement = document.querySelector('[id="company"]')
    if (companyElement && companyElement.getAttribute('listener') !== 'true') {
      companyElement.addEventListener('select', useGeneralListener)
    }

    return () => {
      feedNameElement?.removeEventListener('change', useGeneralListener)
      urlElement?.removeEventListener('change', useUrlListener)
      etagElement?.removeEventListener('change', useGeneralListener)
      contextElement?.removeEventListener('change', useGeneralListener)
      companyElement?.removeEventListener('select', useGeneralListener)
    }
  }, [useGeneralListener, useUrlListener])

  useEffect(() => {
    if (!formats || formats.length === 0) {
      return
    }
    const formatElement = document.querySelector('[id="format"]')
    if (formatElement && formatElement.getAttribute('listener') !== 'true') {
      formatElement.addEventListener('select', useGeneralListener)
    }

    return () => {
      formatElement?.removeEventListener('select', useGeneralListener)
    }
  }, [formats, useGeneralListener, useUrlListener])

  return (
    <div className={'form-section'}>
      <h5>{t('services:testData:form:section:basic')}</h5>

      <div id={'company'} className={'input-wrapper'}>
        <FdsDropdownComponent
          name={'businessId'}
          label={t('services:testData:form:company') + ' *'}
          options={companyOptions}
          message={(formErrors['businessId'] as string) || ''}
          error={!!formErrors['businessId']}
          value={formData.businessId ? companyOptions.filter((c) => c.value === formData.businessId)[0] : undefined}
        />
      </div>

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

      <div id={'context'} className={'input-wrapper'}>
        <FdsInputComponent
          clearable={true}
          name={'context'}
          placeholder={'manual submision from VACO UI'}
          label={t('services:testData:form:context')}
          message={(formErrors['context'] as string) || t('services:testData:form:contextInfo')}
          error={!!formErrors['context']}
        />
      </div>

      <div id={'etag'} className={'input-wrapper etag'}>
        <FdsInputComponent clearable={true} name={'etag'} label={t('services:testData:form:etag')} />
      </div>

      {formatOptions.length > 0 && (
        <div id={'format'} className={'input-wrapper format'}>
          <FdsDropdownComponent
            name={'format'}
            label={t('services:testData:form:format') + ' *'}
            options={formatOptions}
            message={(formErrors.format as string) || ''}
            error={!!formErrors.format}
            // Providing value would show selected option in the drop-down list in a highlighted way
            value={formData.format ? formatOptions.filter((c) => c.value === formData.format)[0] : undefined}
          />
        </div>
      )}
      {formatOptions.length == 0 && formData.businessId && !isFetchInProgress && (
        <div className={'error'}>{t('services:testData:form:noValidationRulesFound')}</div>
      )}
    </div>
  )
}

export default BasicInformation
