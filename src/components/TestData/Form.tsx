import './_form.scss'
import { FdsAlertComponent } from '../fds/FdsAlertComponent'
import { useCallback, useState } from 'react'
import { EntryResource } from '../../types/EntryResource'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { useAcquireToken } from '../../hooks/auth'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import SubmissionModal from './SubmissionModal/SubmissionModal'
import { useNavigate } from 'react-router-dom'
import { Map } from '../../types/Map'
import { submitData } from './helpers'
import { useCompanyRulesFetch, useRulesForFormat, useUserEmail } from './hooks'
import BasicInformation from './BasicInformation/BasicInformation'
import Rules from './Rules/Rules'

const Form = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [accessToken] = useAcquireToken()
  const { instance, inProgress } = useMsal()
  const [formData, setFormData] = useState<Map>({})
  const [formErrors, setFormErrors] = useState<Map>({})
  const [formats, validationRules, isFetchInProgress] = useCompanyRulesFetch(
    formData.businessId as string | undefined,
    accessToken
  )
  const [validationRulesForSelectedFormat] = useRulesForFormat(formData.format as string | undefined, validationRules)
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [email] = useUserEmail(accessToken)

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const navigateToProcessingResults = () => {
    navigate('/data/' + entryResource?.data.publicId)
  }

  const updateFormState = useCallback((newFormData: Map | null, newFormErrors: Map | null) => {
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
          email={email}
          close={closeModal}
          proceed={navigateToProcessingResults}
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
          rules={validationRulesForSelectedFormat}
        />

        {formErrors &&
          (formErrors.url ||
            formErrors.format ||
            formErrors.businessId ||
            formErrors.rules ||
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
                validationRulesForSelectedFormat,
                email
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
