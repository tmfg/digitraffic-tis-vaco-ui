import './_report.scss'
import { RuleReport } from '../../../types/EntryStateResource'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import FindingCounters from './FindingCounters'
import FindingsTable from './FindingsTable'
import PackageButton from '../PackageButton'

interface ValidationReportProps {
  report: RuleReport
}

const ValidationReport = ({ report }: ValidationReportProps) => {
  const { t } = useTranslation()
  const header: KeyValuePairItem[] = [
    {
      label: t('services:processingResults:validationRule'),
      value: report.ruleDescription
    }
  ]

  return (
    <div className={'report-container'}>
      <KeyValuePairs items={header} variant={KeyValuePairVariant.bigger} />
      <FindingCounters counters={report.findingCounters} />
      {report.findings && report.findings.length > 0 && (
        <FindingsTable aggregatedFindings={report.findings} ruleName={report.ruleName} />
      )}
      {report.packages && report.packages.length > 0 && (
        <div className={'packages-container'}>
          <h5>{t('services:processingResults:packages:header')}</h5>
          <div className={'intro'}>{t('services:processingResults:packages:intro')}</div>
          {report.packages.map((p) => {
            return <PackageButton key={'package-' + p.data.name} entryPackage={p} />
          })}
        </div>
      )}
    </div>
  )
}

export default ValidationReport
