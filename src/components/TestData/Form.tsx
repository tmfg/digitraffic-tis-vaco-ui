import './_form.scss'
import { FdsAlertComponent } from '../fds/FdsAlertComponent'
import { useCallback, useState } from 'react'
import { EntryResource } from '../../types/EntryResource'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { useOptionalAccessToken } from '../../hooks/optionalAccessToken'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import SubmissionModal from './SubmissionModal/SubmissionModal'
import { useNavigate } from 'react-router-dom'
import { submitData } from './helpers'
import { useCompanyRulesFetch, useRulesForFormat } from './hooks'
import BasicInformation from './BasicInformation/BasicInformation'
import Rules from './Rules/Rules'
import { FormError, FormData } from './types'
import { PublicValidationTest } from '../../types/PublicValidationTest'

const Form = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [accessToken, ready] = useOptionalAccessToken()
  const { instance, inProgress } = useMsal()
  // Everyone submits to the public test company. The server ignores any other company, context, credentials or
  // notification, so the form does not ask for them.
  const [formData, setFormData] = useState<FormData>({
    sendNotifications: false,
    businessId: PublicValidationTest.businessId
  })
  const [formErrors, setFormErrors] = useState<FormError>({})
  const [formats, validationRules, conversionRules, isFetchInProgress] = useCompanyRulesFetch(
    PublicValidationTest.businessId,
    accessToken,
    ready
  )
  const [validationRulesForSelectedFormat] = useRulesForFormat(formData.format, validationRules)
  const [conversionRulesForSelectedFormat] = useRulesForFormat(formData.format, conversionRules)
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const navigateToProcessingResults = () => {
    navigate('/data/' + entryResource?.data.publicId)
  }

  const updateFormState = useCallback((newFormData: FormData | null, newFormErrors: FormError | null) => {
    if (newFormData) {
      setFormData(newFormData)
    }
    if (newFormErrors) {
      setFormErrors(newFormErrors)
    }
  }, [])

  return (
    <>
      {entryResource && isModalOpen && (
        <SubmissionModal
          publicId={entryResource.data.publicId}
          close={closeModal}
          proceed={navigateToProcessingResults}
          sendNotifications={false}
        />
      )}
      <h3 className={'form-title'}>{t('services:testData:form:title')}</h3>
      <form>
        <BasicInformation
          formData={formData}
          formErrors={formErrors}
          formStateUpdateCallback={updateFormState}
          formats={formats}
          isFetchInProgress={isFetchInProgress}
        />

        <Rules
          formData={formData}
          formErrors={formErrors}
          formStateUpdateCallback={updateFormState}
          validationRules={validationRulesForSelectedFormat}
          conversionRules={conversionRulesForSelectedFormat}
        />

        {formErrors &&
          (formErrors.url ||
            formErrors.format ||
            formErrors.businessId ||
            formErrors.rulesRequired ||
            ((formData.format as string)?.toLowerCase() === 'netex' &&
              validationRulesForSelectedFormat.filter((rule) => formErrors[rule.data.identifyingName + '-codespace'])
                .length > 0)) && (
            <div data-testid="error-alert" className={'form-section'}>
              <FdsAlertComponent icon={'alert-circle'}>{t('services:testData:form:error')}</FdsAlertComponent>
            </div>
          )}

        <div className={'form-section'} style={{ marginBottom: '1.5rem' }}>
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
                (validationRulesForSelectedFormat || []).concat(conversionRulesForSelectedFormat || [])
              ).catch(
                (err) => console.error('Data submission error', err)
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
