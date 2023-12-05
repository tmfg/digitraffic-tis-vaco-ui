import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { acquireToken } from '../../hooks/auth'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { InteractionStatus } from '@azure/msal-browser'
import { useTranslation } from 'react-i18next'
import Section from '../../components/ProcessingResults/Section'
import Reports from '../../components/ProcessingResults/Reports'
import Conversion from '../../components/ProcessingResults/Conversion'
import { EntryStateResource } from '../../types/EntryStateResource'
import SubmittedData from '../../components/ProcessingResults/SubmittedData'

const ProcessingResultsPage = () => {
  const { entryId } = useParams()
  const [entryState, setEntryState] = useState<EntryStateResource | null>(null)
  const { instance, inProgress } = useMsal()
  const { t } = useTranslation()

  useEffect(() => {
    let ignore = false
    setEntryState(null)
    if (entryId && inProgress === InteractionStatus.None && !ignore) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }

          HttpClient.get('/api/ui/entries/' + entryId + '/state', getHeaders(tokenResult.accessToken)).then(
            (response) => {
              if (!ignore) {
                setEntryState(response.data as EntryStateResource)
              }
            },
            (error) => {
              // TODO: show alert
              return Promise.reject(error)
            }
          )
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [entryId, instance, inProgress])

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h2>{t('services:processingResults:header')}</h2>
        {!entryState && 'Loading!'}
        {entryState && (
          <div>
            <SubmittedData entry={entryState.data.entry} />

            <Section titleKey={'reports'}>
              <Reports />
            </Section>

            <Section titleKey={'artifacts:conversion'}>
              <Conversion />
            </Section>
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default ProcessingResultsPage
