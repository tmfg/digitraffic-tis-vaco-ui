import './_report.scss'
import { RuleReport } from '../../../types/EntryStateResource'
import Section from '../../Common/Section/Section.tsx'
import ValidationReport from './ValidationReport.tsx'
import ConversionReport from './ConversionReport.tsx'
import { createContext } from 'react'

interface ReportProps {
  report: RuleReport
}

export const ReportContext = createContext<RuleReport | undefined>(undefined)

const Report = ({ report }: ReportProps) => {
  return (
    <ReportContext.Provider value={report}>
      <Section key={'report-' + report.ruleName} hidable={true} titleKey={report.ruleDescription}>
        {report.ruleType.includes('VALIDATION') && <ValidationReport report={report} />}
        {report.ruleType.includes('CONVERSION') && <ConversionReport report={report} />}
      </Section>
    </ReportContext.Provider>
  )
}

export default Report
