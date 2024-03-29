import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { HttpClient } from '../../HttpClient'
import { useAcquireToken } from '../../hooks/auth'
import { useIsAuthenticated } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { Trans, useTranslation } from 'react-i18next'
import Section from '../../components/Common/Section/Section'
import ConversionReport from '../../components/ProcessingResults/report/ConversionReport'
import { EntryStateResource, RuleReport } from '../../types/EntryStateResource'
import SubmittedData from '../../components/ProcessingResults/SubmittedData'
import ValidationReport from '../../components/ProcessingResults/report/ValidationReport'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import Summary from '../../components/ProcessingResults/summary/Summary'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import { AxiosResponse } from 'axios'
import { useProcessingResultsPageState } from '../../components/ProcessingResults/hooks'
import { EnvironmentContext } from '../../EnvironmentProvider.tsx'
import VacoBadge from '../../components/Common/VacoBadge/VacoBadge.tsx'
import LoadSpinner, { SpinnerVariant } from "../../components/Common/LoadSpinner/LoadSpinner";

const isReportContentAvailable = (reports: RuleReport[]) => {
  return reports.filter((report) => report.findings?.length || report.packages?.length > 0).length
}

// path parameters specifically for this page
type PageParams = {
  entryId: string
}

const ProcessingResultsPage = () => {
  const bootstrap = useContext(EnvironmentContext)
  const navigate = useNavigate()
  const { entryId } = useParams<PageParams>()
  const [searchParams, _] = useSearchParams()
  const magic = searchParams.get('magic')
  const [entryState, setEntryState] = useState<EntryStateResource | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()
  const [accessToken] = useAcquireToken()
  const [magicLinkToken] = useProcessingResultsPageState(entryId, accessToken)
  const [processingProgress, setProcessingProgress] = useState<number>(100)
  const [showMagicLinkGotCopied, setShowMagicLinkGotCopied] = useState<boolean>(false)
  const validationReports: RuleReport[] = entryState?.data.reports
    ? entryState.data.reports.filter((report) => report.ruleType.includes('VALIDATION'))
    : []
  const conversionReports: RuleReport[] = entryState?.data.reports
    ? entryState.data.reports.filter((report) => report.ruleType.includes('CONVERSION'))
    : []

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
    await navigator.clipboard.writeText(url.toString()).then(() => {})
    setShowMagicLinkGotCopied(true)
    setTimeout(() => setShowMagicLinkGotCopied(false), 3000)
  }

  return (
    <div className={'page-content'}>
      {searchParams.has('magic') || isAuthenticated ? (
        <>
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
              {magicLinkToken && (
                <div style={{ display: 'flex' }}>
                  {showMagicLinkGotCopied && (
                    <div style={{ marginTop: '12px', marginRight: '12px', color: '#1777F8', fontWeight: 700 }}>
                      {t('common:copied')}
                    </div>
                  )}
                  <FdsButtonComponent
                    onClick={() => copyMagicLinkToClipboard()}
                    slot="separated"
                    icon="wand-2"
                    iconSize={FdsTokenSize2}
                    variant={FdsButtonVariant.secondary}
                    label={t('services:processingResults:magicLink')}
                  />
                </div>
              )}
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

              {validationReports.length > 0 && isReportContentAvailable(validationReports) ? (
                <Section hidable={true} titleKey={'services:processingResults:reports'}>
                  {validationReports.map((report) => {
                    return <ValidationReport key={'report-' + report.ruleName} report={report} />
                  })}
                </Section>
              ) : (
                ''
              )}

              {conversionReports.length > 0 && isReportContentAvailable(conversionReports) ? (
                <Section hidable={true} titleKey={'services:processingResults:results:conversion'}>
                  {conversionReports.map((report) => {
                    return <ConversionReport key={'report-' + report.ruleName} report={report} />
                  })}
                </Section>
              ) : (
                ''
              )}
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
