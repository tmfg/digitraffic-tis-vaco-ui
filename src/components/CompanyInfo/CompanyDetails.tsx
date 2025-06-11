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
import { generalListener } from '../../util/form'
import { useMsal } from '@azure/msal-react'
import { PublicValidationTest } from '../../types/PublicValidationTest'
import { FdsCheckboxComponent } from '../fds/FdsCheckboxComponent'

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

  const updateFormState = useCallback((newFormData: Map | null, newFormErrors: Map | null) => {
    if (newFormData) {
      setFormData(newFormData)
    }
    if (newFormErrors) {
      setFormErrors(newFormErrors)
    }
  }, [])

  const useGeneralListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      generalListener(e, updateFormState, formData, formErrors)
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
    const publishCheckboxElement = document.querySelector('[id="publish"]')
    if (publishCheckboxElement && publishCheckboxElement.getAttribute('listener') !== 'true') {
      publishCheckboxElement.addEventListener('check', useGeneralListener)
    }
    const codespacesElement = document.querySelector('[id="codespaces"]')
    if (codespacesElement && codespacesElement.getAttribute('listener') !== 'true') {
      codespacesElement.addEventListener('change', useGeneralListener)
    }
    const notificationWebhookUriElement = document.querySelector('[id="notificationWebhookUri"]')
    if (notificationWebhookUriElement && notificationWebhookUriElement.getAttribute('listener') !== 'true') {
      notificationWebhookUriElement.addEventListener('change', useGeneralListener)
    }
    const website = document.querySelector('[id="website"]')
    if (website && website.getAttribute('listener') !== 'true') {
      website.addEventListener('change', useGeneralListener)
    }
    const authorityCheckboxElement = document.querySelector('[id="authority"]')
    if (authorityCheckboxElement && authorityCheckboxElement.getAttribute('listener') !== 'true') {
      authorityCheckboxElement.addEventListener('check', useGeneralListener)
    }
    const operatorCheckboxElement = document.querySelector('[id="operator"]')
    if (operatorCheckboxElement && operatorCheckboxElement.getAttribute('listener') !== 'true') {
      operatorCheckboxElement.addEventListener('check', useGeneralListener)
    }
    return () => {
      nameElement?.removeEventListener('change', useGeneralListener)
      contactEmailsElement?.removeEventListener('change', useGeneralListener)
      languageElement?.removeEventListener('select', useGeneralListener)
      adGroupIdElement?.removeEventListener('change', useGeneralListener)
      publishCheckboxElement?.removeEventListener('check', useGeneralListener)
      codespacesElement?.removeEventListener('change', useGeneralListener)
      notificationWebhookUriElement?.removeEventListener('change', useGeneralListener)
      website?.removeEventListener('change', useGeneralListener)
      authorityCheckboxElement?.removeEventListener('check', useGeneralListener)
      operatorCheckboxElement?.removeEventListener('check', useGeneralListener)
    }
  }, [useGeneralListener])

  return (
    <section>
      <KeyValuePairs items={companyDetails} variant={KeyValuePairVariant.big} />
      {!isEditing && (
        <FdsButtonComponent
          icon="pencil-line"
          style={{ marginTop: '2.5rem', marginBottom: '0.5rem' }}
          onClick={(e) => {
            e.preventDefault()
            const formData = {
              name: company.name,
              businessId: company.businessId,
              language: company.language,
              adGroupId: company.adGroupId,
              contactEmails: company.contactEmails?.join(', '),
              publish: company.publish,
              codespaces: company.codespaces?.join(', '),
              notificationWebhookUri: company.notificationWebhookUri,
              website: company.website,
              authority: company.roles.indexOf("authority") !== -1,
              operator: company.roles.indexOf("operator") !== -1,
            }
            setFormData(formData)
            setFormErrors({})
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
              (err) => console.error('Company data submission error', err)
              // TODO: show some alert
            )
          }}
        >
          <div style={{ padding: '8px', paddingTop: '16px' }}>
            {company.name !== PublicValidationTest.companyName && (
              <div id={'name'} className={'input-wrapper'}>
                <FdsInputComponent
                  clearable={true}
                  name={'name'}
                  label={t('admin:company:name')}
                  value={formData.name ? (formData.name as string) : ''}
                  message={(formErrors.name as string) || ''}
                  error={!!formErrors.name}
                />
              </div>
            )}

            <div id={'language'} className={'input-wrapper'}>
              <FdsDropdownComponent
                name={'language'}
                label={t('admin:company:language')}
                options={languageOptions}
                // Providing value would show selected option in the drop-down list in a highlighted way
                value={formData.language ? languageOptions.filter((l) => l.value === formData.language)[0] : undefined}
              />
            </div>

            {company.name !== PublicValidationTest.companyName && (
              <div id={'adGroupId'} className={'input-wrapper'}>
                <FdsInputComponent
                  clearable={true}
                  value={formData.adGroupId ? (formData.adGroupId as string) : ''}
                  name={'adGroupId'}
                  label={t('admin:company:adGroupId')}
                />
              </div>
            )}

            <div id={'contactEmails'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                value={formData.contactEmails ? (formData.contactEmails as string) : ''}
                name={'contactEmails'}
                label={t('admin:company:contactEmails')}
                message={t('common:separatedByCommaMessage')}
              />
            </div>

            <div id={'publish'} className={'input-wrapper'}>
              <FdsCheckboxComponent
                checked={formData.publish as boolean}
                name={'publish'}
                label={t('admin:company:publish')}
              />
            </div>

            <div id={'codespaces'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                value={formData.codespaces ? (formData.codespaces as string) : ''}
                name={'codespaces'}
                label={t('admin:company:codespaces')}
                message={t('common:separatedByCommaMessage')}
              />
            </div>

            <div id={'notificationWebhookUri'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                value={formData.notificationWebhookUri ? (formData.notificationWebhookUri as string) : ''}
                name={'notificationWebhookUri'}
                label={t('admin:company:notificationWebhookUri')}
              />
            </div>

            <div id={'website'} className={'input-wrapper'}>
              <FdsInputComponent
                clearable={true}
                value={formData.website ? (formData.website as string) : ''}
                name={'website'}
                label={t('admin:company:website')}
              />
            </div>
            <div id={'authority'} className={'input-wrapper'}>
              <FdsCheckboxComponent
                checked={formData.authority === true}
                name={'authority'}
                label={t('admin:company:authority')}
              />
            </div>
            <div id={'operator'} className={'input-wrapper'}>
              <FdsCheckboxComponent
                checked={formData.operator === true}
                name={'operator'}
                label={t('admin:company:operator')}
              />
            </div>
          </div>
        </FormContainer>
      )}
    </section>
  )
}

export default CompanyDetails
