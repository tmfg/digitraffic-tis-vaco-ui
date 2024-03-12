import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from 'react'
import { HttpClient } from '../../HttpClient'
import { acquireToken } from '../../hooks/auth'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { InteractionStatus } from "@azure/msal-browser";
import { Trans, useTranslation } from 'react-i18next'
import Section from '../../components/Common/Section/Section'
import ConversionReport from '../../components/ProcessingResults/report/ConversionReport'
import { EntryStateResource, RuleReport } from '../../types/EntryStateResource'
import SubmittedData from '../../components/ProcessingResults/SubmittedData'
import ValidationReport from '../../components/ProcessingResults/report/ValidationReport'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import Summary from '../../components/ProcessingResults/summary/Summary'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsTokenSize2 } from "../../../coreui-css/lib";
import { useProcessingResultsPageData } from "../../hooks/processingResults.ts";
import { AxiosResponse } from "axios";

const isReportContentAvailable = (reports: RuleReport[]) => {
  return reports.filter((report) => report.findings?.length || report.packages?.length > 0).length
}

// path parameters specifically for this page
type PageParams = {
  entryId: string;
}

const ProcessingResultsPage = () => {
  const navigate = useNavigate()
  const { entryId } = useParams<PageParams>()
  const [searchParams, _] = useSearchParams()
  const [entryState, setEntryState] = useState<EntryStateResource | null>(null)
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const { t } = useTranslation()
  const [processingProgress, setProcessingProgress] = useState<number>(100)
  const validationReports: RuleReport[] = entryState?.data.reports
    ? entryState.data.reports.filter((report) => report.ruleType.includes('VALIDATION'))
    : []
  const conversionReports: RuleReport[] = entryState?.data.reports
    ? entryState.data.reports.filter((report) => report.ruleType.includes('CONVERSION'))
    : []
  const [pageData] = useProcessingResultsPageData(entryId)

  function handleEntryStateResponse(response: AxiosResponse<any>) {
        const entryResource: EntryStateResource = response.data as EntryStateResource
        setEntryState(entryResource)

        const tasks = entryResource.data.entry.data.tasks
        if (tasks) {
          const completeTasks: number = tasks.filter((task) => task.completed).length
          setProcessingProgress(completeTasks ? (completeTasks / tasks.length) * 100 : 0)
    }
  }

  function handleError(error: any) {
    // TODO: show alert
    return Promise.reject(error)
  }

  useEffect(() => {
    setEntryState(null)
    if (entryId) {
      // 1) prepare request options based on available authorization information
      const params = new Promise<Map<string, string>>((resolve, _reject) => {
        let params = new Map<string, string>()
        let magic = searchParams.get('magic')
        if (magic) {
          params.set('magic', magic)
        }
        resolve(params)
      })

      const headers = new Promise<Map<string, string>>((resolve, _reject) => {
        if (inProgress === InteractionStatus.None && isAuthenticated) {
          acquireToken(instance, inProgress).then(
            (tokenResult) => {
              let headers = new Map<string, string>()
              if (!tokenResult) {
                // TODO: At some point, show some error notification
                return
              }
              headers.set('Authorization', 'Bearer ' + tokenResult.accessToken)
              resolve(headers)
            },
            handleError
          )
        } else {
          resolve(new Map<string, string>())
        }
      })

      Promise.all([params, headers]).then(configs => {
        let config =           {
          params: Object.fromEntries(configs[0].entries()),
          headers: Object.fromEntries(configs[1].entries())
        }

        return HttpClient.get(
          '/api/ui/entries/' + entryId + '/state',
          config
        ).then(
          handleEntryStateResponse,
          handleError
        )
      })
      return () => {

      }
    } else {
      // no entryId available, do nothing
    }
  }, [entryId, instance, inProgress, isAuthenticated, pageData])

  function copyMagicLinkToClipboard(magicLinkToken:string) {
    const url = new URL(window.location.href)
    url.searchParams.append('magic', magicLinkToken)
    navigator.clipboard.writeText(url.toString()).then(() => {
    });
  }

  return (
    <div className={'page-content'}>
      {(searchParams.has('magic') || isAuthenticated) ? (
        <>
          <div style={{ display: 'flex', marginBottom: 0, alignItems: 'center', justifyContent: 'space-between'}}>
            <h1 style={{ marginRight: '3rem' }}>
              {t('services:processingResults:header')}
              {entryState?.data.entry.links.refs.badge && (
                <img
                  style={{ width: '120px', marginLeft: "3rem"}}
                  alt={'badge'}
                  src={entryState.data.entry.links.refs.badge.href}
                />
              )}</h1>
            <span className={'icon'}>
            {pageData?.data.magicLinkToken && (
              <FdsButtonComponent
                onClick={() => copyMagicLinkToClipboard(pageData?.data.magicLinkToken)}
                slot="separated"
                icon="wand-2"
                iconSize={FdsTokenSize2}
                variant={FdsButtonVariant.secondary}
                label={'Get magic link'}
              />
            )}
          </span>
          </div>
          {!entryState && ''}
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

              {entryState.data.summaries?.length > 0 && (
                <Section hidable={true} titleKey={'services:processingResults:summary'}>
                  <Summary summaries={entryState.data.summaries} />
                </Section>
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
