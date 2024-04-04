import './_report.scss'
import { RuleReport } from '../../../types/EntryStateResource'
import FindingCounters from './FindingCounters'
import FindingsTable from './FindingsTable'
import { useIsAuthenticated } from '@azure/msal-react'
import Packages from './Packages.tsx'

interface ValidationReportProps {
  report: RuleReport
}

const ValidationReport = ({ report }: ValidationReportProps) => {
  const isAuthenticated = useIsAuthenticated()

  return (
    <div className={'report-container'}>
      <FindingCounters counters={report.findingCounters} />
      {report.findings && report.findings.length > 0 && (
        <FindingsTable aggregatedFindings={report.findings} ruleName={report.ruleName} />
      )}
      {isAuthenticated && report.packages && report.packages.length > 0 && (
        <Packages ruleType={report.ruleType} packages={report.packages} />
      )}
    </div>
  )
}

export default ValidationReport
