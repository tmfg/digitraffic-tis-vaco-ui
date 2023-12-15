import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { acquireToken } from '../../hooks/auth'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { InteractionStatus } from '@azure/msal-browser'
import { useTranslation } from 'react-i18next'
import Section from '../../components/ProcessingResults/Section'
import Conversion from '../../components/ProcessingResults/Conversion'
import { EntryStateResource } from '../../types/EntryStateResource'
import SubmittedData from '../../components/ProcessingResults/SubmittedData'
import ValidationReport from '../../components/ProcessingResults/report/ValidationReport'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import { useNavigate } from 'react-router-dom'

const ProcessingResultsPage = () => {
  const { entryId } = useParams()
  const navigate = useNavigate()
  const [entryState, setEntryState] = useState<EntryStateResource | null>(null)
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()
  const [processingProgress, setProcessingProgress] = useState<number>(100)

  useEffect(() => {
    let ignore = false
    setEntryState(null)
    if (entryId && inProgress === InteractionStatus.None && !ignore && isAuthenticated) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }

          HttpClient.get('/api/ui/entries/' + entryId + '/state', getHeaders(tokenResult.accessToken)).then(
            (response) => {
              if (!ignore) {
                const entryResource: EntryStateResource = response.data as EntryStateResource
                setEntryState(entryResource)

                const tasks = entryResource.data.entry.data.tasks
                if (tasks) {
                  const completeTasks: number = tasks.filter((task) => task.completed).length
                  setProcessingProgress(completeTasks ? (completeTasks / tasks.length) * 100 : 0)
                }
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ marginRight: '3rem' }}>{t('services:processingResults:header')}</h1>
          {entryState?.data.entry.links.refs.badge && (
            <img
              style={{ width: '130px', marginTop: '-4px' }}
              alt={'badge'}
              src={entryState.data.entry.links.refs.badge.href}
            />
          )}
        </div>
        {!entryState && ''}
        {entryState && (
          <div>
            <SubmittedData entry={entryState.data.entry.data} />

            {!entryState.data.entry.data.completed && processingProgress !== 100 && !entryState.error && (
              <Section hidable={false} titleKey={'inProgress'}>
                <div style={{ marginBottom: '1.75rem' }}>
                  {t('services:processingResults:progress', { percentage: Math.round(processingProgress) })}
                </div>
                <FdsButtonComponent icon="refresh-cw" onClick={() => navigate(0)} label={t('common:refresh')} />
              </Section>
            )}

            {entryState.data.validationReports?.length > 0 && (
              <Section hidable={true} titleKey={'reports'}>
                {entryState.data.validationReports.map((report) => {
                  return <ValidationReport key={'report-' + report.ruleName} report={report} />
                })}
              </Section>
            )}

            {entryState.data.entry.data.conversions && entryState.data.entry.data.conversions.length > 0 && (
              <Section hidable={true} titleKey={'artifacts:conversion'}>
                <Conversion />
              </Section>
            )}
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
