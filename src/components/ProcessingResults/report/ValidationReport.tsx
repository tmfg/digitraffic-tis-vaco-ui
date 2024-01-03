import { ValidationReport as ValidationReportResource } from '../../../types/EntryStateResource'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import './_validationReport.scss'
import ReportStats from './ReportStats'
import NoticesTable from './NoticesTable'
import PackageButton from '../PackageButton'

interface ValidationReportProps {
  report: ValidationReportResource
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
      <ReportStats counters={report.counters} />
      {report.notices && <NoticesTable notices={report.notices} ruleName={report.ruleName} />}
      {report.packages && report.packages.length > 0 && (
        <div className={'packages-container'}>
          <h5>{t('services:processingResults:artifacts:validation')}</h5>
          {report.packages.map((p) => {
            return <PackageButton key={'package-' + p.data.name} entryPackage={p} />
          })}
        </div>
      )}
    </div>
  )
}

export default ValidationReport
