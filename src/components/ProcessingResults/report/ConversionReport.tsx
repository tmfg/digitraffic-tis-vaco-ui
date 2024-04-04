import './_report.scss'
import { RuleReport } from '../../../types/EntryStateResource'
import { useIsAuthenticated } from '@azure/msal-react'
import Packages from './Packages.tsx'

interface ConversionReportProps {
  report: RuleReport
}

const ConversionReport = ({ report }: ConversionReportProps) => {
  const isAuthenticated = useIsAuthenticated()

  return (
    <div className={'report-container'}>
      <div className={'packages-container'}>
        {isAuthenticated && report.packages && report.packages.length > 0 && (
          <Packages ruleType={report.ruleType} packages={report.packages} />
        )}
      </div>
    </div>
  )
}

export default ConversionReport
