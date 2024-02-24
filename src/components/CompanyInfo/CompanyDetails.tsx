import { Company, CompanyHierarchy } from '../../types/Company'
import { useCallback, useEffect, useState } from 'react'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import FormContainer from '../Common/Form/FormContainer'
import { FdsDropdownComponent } from '../fds/FdsDropdownComponent'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { Map } from '../../types/Map'
import { getCompanyInfoKeyValuePairs, submitCompanyData } from './helpers'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { getNewFormErrorsState, getNewFormState } from '../../util/form'
import { useMsal } from '@azure/msal-react'

interface CompanyDetailsProps {
  company: Company
  onEditCompanyCallback: (c: Company) => void
  onEditHierarchiesCallback: (h: CompanyHierarchy[]) => void
}

const CompanyDetails = ({ company, onEditCompanyCallback, onEditHierarchiesCallback }: CompanyDetailsProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [companyDetails, setCompanyDetails] = useState<KeyValuePairItem[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [formData, setFormData] = useState<Map>({})
  const [formErrors, setFormErrors] = useState<Map>({})
  const languageOptions = [
    { label: t('languages:fi'), value: 'fi' },
    { label: t('languages:sv'), value: 'sv' },
    { label: t('languages:en'), value: 'en' }
  ]

  useEffect(() => {
    if (company) {
      const details: KeyValuePairItem[] = getCompanyInfoKeyValuePairs(company, t)
      setCompanyDetails(details)
    }
  }, [company, t])

  const updateFormState = useCallback((newFormData: Map, newFormErrors: Map) => {
    setFormData(newFormData)
    setFormErrors(newFormErrors)
  }, [])

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
    const nameElement = document.querySelector('[id="name"]')
    if (nameElement && nameElement.getAttribute('listener') !== 'true') {
      nameElement.addEventListener('change', useGeneralListener)
    }
    const languageElement = document.querySelector('[id="language"]')
    if (languageElement && languageElement.getAttribute('listener') !== 'true') {
      languageElement.addEventListener('select', useGeneralListener)
    }
    const adGroupIdElement = document.querySelector('[id="adGroupId"]')
    if (adGroupIdElement && adGroupIdElement.getAttribute('listener') !== 'true') {
      adGroupIdElement.addEventListener('change', useGeneralListener)
    }
    const contactEmailsElement = document.querySelector('[id="contactEmails"]')
    if (contactEmailsElement && contactEmailsElement.getAttribute('listener') !== 'true') {
      contactEmailsElement.addEventListener('change', useGeneralListener)
    }

    return () => {
      nameElement?.removeEventListener('change', useGeneralListener)
      contactEmailsElement?.removeEventListener('change', useGeneralListener)
      languageElement?.removeEventListener('select', useGeneralListener)
      adGroupIdElement?.removeEventListener('change', useGeneralListener)
    }
  }, [useGeneralListener])

  return (
    <div className={'section'}>
      <KeyValuePairs items={companyDetails} variant={KeyValuePairVariant.big} />
      {!isEditing && (
        <FdsButtonComponent
          icon="pencil-line"
          style={{ marginTop: '2.5rem' }}
          onClick={(e) => {
            e.preventDefault()
            const formData = {
              name: company.name,
              businessId: company.businessId,
              language: company.language,
              adGroupId: company.adGroupId,
              contactEmails: company.contactEmails?.join(', ')
            }
            setFormData(formData)
            setIsEditing(!isEditing)
          }}
          label={t('admin:company:edit')}
        />
      )}

      {isEditing && (
        <FormContainer
          titleKey={'admin:company:edit'}
          cancelCallback={() => {
            setIsEditing(false)
          }}
          submitCallback={() => {
            submitCompanyData(
              instance,
              inProgress,
              formData,
              setFormErrors,
              onEditCompanyCallback,
              onEditHierarchiesCallback,
              setIsEditing,
              t,
              company.businessId
            ).catch(
              (err) => console.error('Comapny data submission error', err)
              // TODO: show some alert
            )
          }}
        >
          <div style={{ padding: '8px', paddingTop: '16px' }}>
            <div id={'name'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                name={'name'}
                label={t('admin:company:name')}
                value={formData.name ? (formData.name as string) : ''}
                error={!!formErrors.name}
              />
            </div>

            <div id={'language'} className={'input-wrapper'}>
              <FdsDropdownComponent
                name={'language'}
                label={t('admin:company:language')}
                options={languageOptions}
                // Providing value would show selected option in the drop-down list in a highlighted way
                value={formData.language ? languageOptions.filter((l) => l.value === formData.language)[0] : undefined}
              />
            </div>

            <div id={'adGroupId'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                value={formData.adGroupId ? (formData.adGroupId as string) : ''}
                name={'adGroupId'}
                label={t('admin:company:adGroupId')}
              />
            </div>

            <div id={'contactEmails'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                value={formData.contactEmails ? (formData.contactEmails as string) : ''}
                name={'contactEmails'}
                label={t('admin:company:contactEmails')}
                message={t('common:separatedByCommaMessage')}
              />
            </div>
          </div>
        </FormContainer>
      )}
    </div>
  )
}

export default CompanyDetails
