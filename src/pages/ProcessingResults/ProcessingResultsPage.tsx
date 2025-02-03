import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from 'react'
import { HttpClient } from '../../HttpClient'
import { useAcquireToken } from '../../hooks/auth'
import { useIsAuthenticated } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { Trans, useTranslation } from 'react-i18next'
import Section from '../../components/Common/Section/Section'
import { EntryStateResource } from '../../types/EntryStateResource'
import SubmittedData from '../../components/ProcessingResults/SubmittedData'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import Summary from '../../components/ProcessingResults/summary/Summary'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import { AxiosResponse } from 'axios'
import { useProcessingResultsPageState } from '../../components/ProcessingResults/hooks'
import { EnvironmentContext } from '../../EnvironmentProvider.tsx'
import VacoBadge from '../../components/Common/VacoBadge/VacoBadge.tsx'
import LoadSpinner, { SpinnerVariant } from '../../components/Common/LoadSpinner/LoadSpinner'
import Report from '../../components/ProcessingResults/report/Report.tsx'
import { Task } from '../../types/Task'
import { postRerunEntry } from '../AdminTools/CompanyEntries/hooks.ts'
import { AppContext, AppContextType } from '../../AppContextProvider.tsx'
import { Company } from '../../types/Company.ts'
import SubmissionModal from '../../components/TestData/SubmissionModal/SubmissionModal.tsx'
import { useUserEmail } from '../../components/TestData/hooks.ts'
import { EntryResource } from '../../types/EntryResource.ts'

//const isReportContentAvailable = (reports: RuleReport[]) => {
//  return reports.filter((report) => report.findings?.length || report.packages?.length > 0).length
//}

// path parameters specifically for this page
type PageParams = {
  entryId: string
}

export const TaskContext = createContext<Task | undefined>(undefined)

const ProcessingResultsPage = () => {
  const bootstrap = useContext(EnvironmentContext)
  const navigate = useNavigate()
  const { entryId } = useParams<PageParams>()
  const [searchParams, _] = useSearchParams()
  const magic = searchParams.get('magic')
  const [entryState, setEntryState] = useState<EntryStateResource | null>(null)
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()
  const [accessToken] = useAcquireToken()
  const [magicLinkToken] = useProcessingResultsPageState(entryId, accessToken)
  const [processingProgress, setProcessingProgress] = useState<number>(100)
  const [showMagicLinkGotCopied, setShowMagicLinkGotCopied] = useState<boolean>(false)
  const appContext: AppContextType = useContext(AppContext)
  const [userCompanies, setUserCompanies] = useState<Company[] | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [email] = useUserEmail(accessToken)

  useEffect(() => {
    if (appContext?.companies) {
      setUserCompanies(appContext.companies)
    }
  }, [appContext])

  const hasRightToRerun = (businessId: string | undefined) => {
    return userCompanies?.map((c) => c.businessId).includes(businessId as string)
  }

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
    if (magic || accessToken) {
      const config = {
        params: { magic },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }
      setIsFetchInProgress(true)
      HttpClient.get('/api/ui/entries/' + entryId + '/state', config).then(handleEntryStateResponse, handleError)
    }
  }, [accessToken, entryId, magic])

  const copyMagicLinkToClipboard = async () => {
    if (!magicLinkToken) {
      return
    }
    const url = new URL(window.location.href)
    url.searchParams.append('magic', magicLinkToken)
    await navigator.clipboard.writeText(url.toString()).then(() => {
    })
    setShowMagicLinkGotCopied(true)
    setTimeout(() => setShowMagicLinkGotCopied(false), 3000)
  }

  const rerunEntry = (entryState: EntryStateResource | null, accessToken: string | null, setIsModalOpen: (status: boolean) => void, setEntryResource: (entry: EntryResource) => void) => {
    postRerunEntry(entryState?.data.entry, accessToken, setIsModalOpen, setEntryResource)
  }

  return (
    <div className={'page-content'}>
      {searchParams.has('magic') || isAuthenticated ? (
        <>
          {entryResource && isModalOpen && (
            <SubmissionModal
              publicId={entryResource.data.publicId}
              email={email}
              close={closeModal}
              proceed={navigateToProcessingResults}
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
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'flex-start'}}>
                {hasRightToRerun(entryState?.data.entry.data.businessId) && (
                 <FdsButtonComponent
                   onClick={() => rerunEntry(entryState, accessToken, setIsModalOpen, setEntryResource)}
                   icon="refresh-cw"
                   iconSize={FdsTokenSize2}
                   variant={FdsButtonVariant.secondary}
                   label={t('services:processingResults.rerun')}
                 />
                )}
              {magicLinkToken && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <FdsButtonComponent
                    onClick={() => copyMagicLinkToClipboard()}
                    slot="separated"
                    icon="wand-2"
                    iconSize={FdsTokenSize2}
                    variant={FdsButtonVariant.secondary}
                    label={t('services:processingResults:magicLink')}
                  />
                  {showMagicLinkGotCopied && (
                    <div style={{ marginTop: '12px', marginRight: '12px', color: '#1777F8', fontWeight: 700, marginLeft: '3px' }}>
                      {t('common:copied')}
                    </div>
                  )}
                </div>
              )}
                 </div>
            </span>
          </div>
          {isFetchInProgress && <LoadSpinner variant={SpinnerVariant.padded} />}
          {entryState && (
            <div>
              <SubmittedData entry={entryState.data.entry.data} company={entryState.data.company} />

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
      ) : (
        <AuthRequiredPage />
      )}
    </div>
  )
}

export default ProcessingResultsPage
