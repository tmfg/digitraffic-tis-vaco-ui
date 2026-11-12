import { useNavigate, useParams } from 'react-router-dom'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getHeaders, HttpClient } from '../../HttpClient'
import { useOptionalAccessToken } from '../../hooks/optionalAccessToken'
import { Trans, useTranslation } from 'react-i18next'
import Section from '../../components/Common/Section/Section'
import { EntryStateResource, ResultsPageCredentials, ResultsPageTask } from '../../types/EntryStateResource'
import SubmittedData from '../../components/ProcessingResults/SubmittedData'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import Summary from '../../components/ProcessingResults/summary/Summary'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import { AxiosResponse } from 'axios'
import { EnvironmentContext } from '../../EnvironmentProvider.tsx'
import VacoBadge from '../../components/Common/VacoBadge/VacoBadge.tsx'
import LoadSpinner, { SpinnerVariant } from '../../components/Common/LoadSpinner/LoadSpinner'
import Report from '../../components/ProcessingResults/report/Report.tsx'
import { postRerunEntry } from '../AdminTools/CompanyEntries/hooks.ts'
import SubmissionModal from '../../components/TestData/SubmissionModal/SubmissionModal.tsx'
import { useUserEmail } from '../../components/TestData/hooks.ts'
import { EntryResource } from '../../types/EntryResource.ts'
import { useAdminRightsCheck } from '../AdminTools/hooks.ts'

//const isReportContentAvailable = (reports: RuleReport[]) => {
//  return reports.filter((report) => report.findings?.length || report.packages?.length > 0).length
//}

// path parameters specifically for this page
type PageParams = {
  entryId: string
}

export const TaskContext = createContext<ResultsPageTask | undefined>(undefined)

const ProcessingResultsPage = () => {
  const bootstrap = useContext(EnvironmentContext)
  const navigate = useNavigate()
  const { entryId } = useParams<PageParams>()
  const [entryState, setEntryState] = useState<EntryStateResource | null>(null)
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)
  const { t } = useTranslation()
  const [accessToken, ready] = useOptionalAccessToken()
  const [processingProgress, setProcessingProgress] = useState<number>(100)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [email] = useUserEmail(accessToken)
  const [credentials, setCredentials] = useState<ResultsPageCredentials | null | undefined>(undefined)
  const [hasAdminRole] = useAdminRightsCheck()

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const navigateToProcessingResults = () => {
    navigate('/data/' + entryResource?.data.publicId)
    closeModal()
  }

  const handleEntryStateResponse = (response: AxiosResponse<any>) => {
    const entryResource: EntryStateResource = response.data as EntryStateResource
    setEntryState(entryResource)
    setCredentials(entryResource.data.credentials)
    setIsFetchInProgress(false)

    const tasks = entryResource.data.entry.data.tasks
    if (tasks) {
      const completeTasks: number = tasks.filter((task) => task.completed).length
      setProcessingProgress(completeTasks ? (completeTasks / tasks.length) * 100 : 0)
    }
  }

  const handleError = (error: any) => {
    // TODO: show alert
    setIsFetchInProgress(false)
    return Promise.reject(error)
  }

  // TODO: this will move to hooks.ts once stable version of React supports useEffectEvent
  useEffect(() => {
    if (ready) {
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/entries/' + entryId + '/state', getHeaders(accessToken)).then(
        handleEntryStateResponse,
        handleError
      )
    }
  }, [accessToken, ready, entryId])

  const rerunEntry = (publicId: string, accessToken: string | null, setIsModalOpen: (status: boolean) => void, setEntryResource: (entry: EntryResource) => void) => {
    postRerunEntry(publicId, accessToken, setIsModalOpen, setEntryResource)
  }

  const hasPackages= useMemo(() => {
    if (entryState === null) {
      return undefined;
    }
    return entryState.data.reports.some((report) => report.packages.length > 0);

  }, [entryState])

  return (
    <div className={'page-content'}>
      <>
        {entryResource && isModalOpen && (
          <SubmissionModal
            publicId={entryResource.data.publicId}
            email={email}
            close={closeModal}
            proceed={navigateToProcessingResults}
            sendNotifications={entryResource.data.sendNotifications}
          />
        )}
        <div style={{ display: 'flex', marginBottom: 0, alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ marginRight: '3rem' }}>
            {t('services:processingResults:header')}
            {bootstrap && entryState && (
              <VacoBadge
                style={{ width: '120px', marginLeft: '3rem' }}
                bootstrap={bootstrap}
                publicId={entryState.data.entry.data.publicId}
              />
            )}
          </h1>
          <span className={'icon'}>
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'flex-start' }}>
              {entryState && hasAdminRole && (
                <FdsButtonComponent
                  onClick={() =>
                    rerunEntry(entryState.data.entry.data.publicId, accessToken, setIsModalOpen, setEntryResource)
                  }
                  icon="refresh-cw"
                  iconSize={FdsTokenSize2}
                  variant={FdsButtonVariant.secondary}
                  label={t('services:processingResults.rerun')}
                />
              )}
            </div>
          </span>
        </div>
          {isFetchInProgress && <LoadSpinner variant={SpinnerVariant.padded} />}
          {entryState && (
            <div>
              <SubmittedData
                entry={entryState.data.entry.data}
                company={entryState.data.company}
                credentials={credentials}
                hasPackages={hasPackages} />

              {!entryState.data.entry.data.completed && processingProgress !== 100 && !entryState.error && (
                <Section hidable={false} titleKey={'services:processingResults:inProgress'}>
                  <div style={{ marginBottom: '1.75rem' }}>
                    {
                      <Trans
                        i18nKey="services:processingResults:progress"
                        values={{ percentage: Math.round(processingProgress) }}
                      ></Trans>
                    }
                  </div>
                  <FdsButtonComponent
                    variant={FdsButtonVariant.secondary}
                    icon="refresh-cw"
                    onClick={() => navigate(0)}
                    label={t('common:refresh')}
                  />
                </Section>
              )}

              {entryState.data.summaries?.length > 0 ? (
                <Section hidable={true} titleKey={'services:processingResults:summary'}>
                  <Summary summaries={entryState.data.summaries} />
                </Section>
              ) : (
                ''
              )}

              {entryState.data.reports.map((report) => {
                return (
                  <TaskContext.Provider
                    key={'task-provider-report-' + report.name}
                    value={entryState?.data.entry.data.tasks?.filter((t) => t.name === report.name)[0]}
                  >
                    <Report key={'report-' + report.name} entry={entryState?.data.entry.data} report={report} />
                  </TaskContext.Provider>
                )
              })}
            </div>
          )}
        </>
    </div>
  )
}

export default ProcessingResultsPage
