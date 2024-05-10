import './_report.scss'
import { TaskReport } from '../../../types/EntryStateResource'
import Section from '../../Common/Section/Section.tsx'
import ValidationReport from './ValidationReport.tsx'
import ConversionReport from './ConversionReport.tsx'
import { useContext } from 'react'
import VacoBadge from '../../Common/VacoBadge/VacoBadge'
import { EnvironmentContext } from '../../../EnvironmentProvider'
import { Entry } from '../../../types/EntryResource'
import InternalTaskReport from './InternalTaskReport'
import { TaskContext } from '../../../pages/ProcessingResults/ProcessingResultsPage'
import { Status } from '../../../types/Task'
import { useTranslation } from 'react-i18next'

interface ReportProps {
  entry: Entry
  report: TaskReport
}

const Report = ({ report, entry }: ReportProps) => {
  const { i18n } = useTranslation()
  const bootstrap = useContext(EnvironmentContext)
  const task = useContext(TaskContext)

  const getBadge = () => {
    return bootstrap && entry && <VacoBadge bootstrap={bootstrap} publicId={entry.publicId} taskName={report.name} />
  }

  const getIsOpenByDefault = () => {
    return report.type.includes('VALIDATION') || report.type.includes('CONVERSION') || task?.status !== Status.Success
  }

  const anyReportContentToShow = () => {
    return (
      task?.status !== Status.Cancelled &&
      task?.status !== Status.Received &&
      (task?.status === Status.Processing ||
        report.packages?.length > 0 ||
        ((report.findings && report.findings.length > 0) as boolean) ||
        // Showing the green happy zero in case of success and no validation/conversion findings:
        (task?.status !== Status.Success && (report.type.includes('CONVERSION') || report.type.includes('VALIDATION'))))
      // Or otherwise, if there is some info to explain the status...
      //i18n.exists('services:processingResults.internal.status.' + task?.status)
    )
  }

  console.log('hmm', anyReportContentToShow(), report.name, report.packages?.length)
  return (
    <Section
      key={'report-' + report.name}
      badge={getBadge()}
      hidable={anyReportContentToShow()}
      isOpenByDefault={getIsOpenByDefault()}
      titleKey={
        report.description ||
        (i18n.exists('services:processingResults.tasks.' + report.name)
          ? 'services:processingResults.tasks.' + report.name
          : report.name)
      }
    >
      {anyReportContentToShow() ? (
        <>
          {report.type.includes('VALIDATION') && <ValidationReport report={report} />}
          {report.type.includes('CONVERSION') && <ConversionReport report={report} />}
          {report.type === 'INTERNAL' && <InternalTaskReport report={report} />}
        </>
      ) : (
        ''
      )}
    </Section>
  )
}

export default Report
