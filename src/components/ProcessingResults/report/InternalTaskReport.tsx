import './_report.scss'
import { TaskReport } from '../../../types/EntryStateResource'
import FindingsTable from './FindingsTable'
import { useIsAuthenticated } from '@azure/msal-react'
import Packages from './Packages.tsx'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { TaskContext } from '../../../pages/ProcessingResults/ProcessingResultsPage'
import Severity from './Severity'
import { Status } from '../../../types/Task'
import LoadSpinner from '../../Common/LoadSpinner/LoadSpinner'

interface InternalTaskReportProps {
  report: TaskReport
}

const InternalTaskReport = ({ report }: InternalTaskReportProps) => {
  const isAuthenticated = useIsAuthenticated()
  const { t, i18n } = useTranslation()
  const task = useContext(TaskContext)

  const modifiedFindings = report.findings?.map((findingGroup) => ({
    ...findingGroup,
    code: `services:processingResults:DownloadResponse:${findingGroup.code}`,
    findings: findingGroup.findings || [],
  })) || [];

  return (
    <div className={'report-container'}>
      <div>
        {
          i18n.exists('services:processingResults.internal.status.' + task?.status)
            ? t('services:processingResults.internal.status.' + task?.status)
            : ''
          // Here could some text giving more info about the status's meaning
        }
      </div>
      {task?.status === Status.Processing && report.findings?.length === 0 && <LoadSpinner />}
      {report.findings?.length == 1 && (
        <>
          <Severity finding={report.findings[0]} />:{' '}
          <span style={{ marginLeft: '0.5rem' }}>{t(modifiedFindings[0].code)}</span>
        </>
      )}
      {report.findings && report.findings.length > 1 && (
        <FindingsTable aggregatedFindings={report.findings} taskName={report.name} />
      )}
      {isAuthenticated && report.packages && report.packages.length > 0 && (
        <Packages taskType={report.type} packages={report.packages} />
      )}
    </div>
  )
}

export default InternalTaskReport
