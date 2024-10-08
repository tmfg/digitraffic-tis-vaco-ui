import './_report.scss'
import { TaskReport } from '../../../types/EntryStateResource'
import { useIsAuthenticated } from '@azure/msal-react'
import Packages from './Packages.tsx'
import { Status } from '../../../types/Task'
import LoadSpinner from '../../Common/LoadSpinner/LoadSpinner'
import { useContext } from 'react'
import { TaskContext } from '../../../pages/ProcessingResults/ProcessingResultsPage'
import FindingsTable from './FindingsTable.tsx'
import FindingCounters from './FindingCounters.tsx'

interface ConversionReportProps {
  report: TaskReport
}

const ConversionReport = ({ report }: ConversionReportProps) => {
  const isAuthenticated = useIsAuthenticated()
  const task = useContext(TaskContext)

  return (
    <div className={'report-container'}>
      {task?.status === Status.Processing && report.findings?.length === 0 && <LoadSpinner />}
      {((report.findings && report.findings.length > 0) || task?.status !== Status.Processing) && (
        <FindingCounters counters={report.findingCounters} />
      )}
      {report.findings && report.findings.length > 0 && (
        <FindingsTable aggregatedFindings={report.findings} taskName={report.name} />
      )}
      {isAuthenticated && report.packages && report.packages.length > 0 && (
        <Packages taskType={report.type} packages={report.packages} />
      )}
    </div>
  )
}

export default ConversionReport
