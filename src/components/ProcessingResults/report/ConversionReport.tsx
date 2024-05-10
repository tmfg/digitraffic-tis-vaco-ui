import './_report.scss'
import { TaskReport } from '../../../types/EntryStateResource'
import { useIsAuthenticated } from '@azure/msal-react'
import Packages from './Packages.tsx'
import { Status } from '../../../types/Task'
import LoadSpinner from '../../Common/LoadSpinner/LoadSpinner'
import { useContext } from 'react'
import { TaskContext } from '../../../pages/ProcessingResults/ProcessingResultsPage'

interface ConversionReportProps {
  report: TaskReport
}

const ConversionReport = ({ report }: ConversionReportProps) => {
  const isAuthenticated = useIsAuthenticated()
  const task = useContext(TaskContext)

  return (
    <div className={'report-container'}>
      {task?.status === Status.Processing && report.findings?.length === 0 && <LoadSpinner />}
      <div className={'packages-container'}>
        {isAuthenticated && report.packages && report.packages.length > 0 && (
          <Packages taskType={report.type} packages={report.packages} />
        )}
      </div>
    </div>
  )
}

export default ConversionReport
