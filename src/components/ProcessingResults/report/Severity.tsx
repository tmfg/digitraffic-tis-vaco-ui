import { ReactComponent as ErrorSvg } from '../../../assets/svg/error.svg'
import { ReactComponent as WarningSvg } from '../../../assets/svg/warning.svg'
import { ReactComponent as InfoSvg } from '../../../assets/svg/info.svg'
import { useTranslation } from 'react-i18next'
import { AggregatedFinding } from '../../../types/EntryStateResource'

interface SeverityProps {
  finding: AggregatedFinding
}

const Severity = ({ finding }: SeverityProps) => {
  const { t } = useTranslation()

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <ErrorSvg />
      case 'ERROR':
        return <ErrorSvg />
      case 'WARNING':
        return <WarningSvg />
      case 'INFO':
        return <InfoSvg />
      case 'FAILURE':
        return <ErrorSvg />
      default:
        return <InfoSvg />
    }
  }

  return (
    <span className={finding.severity}>
      {getSeverityIcon(finding.severity)} {'  '}
      <span className={finding.severity + '--text'} style={{ marginLeft: '5px' }}>
        {t('services:processingResults:severity:' + finding.severity.toLowerCase())}
      </span>
    </span>
  )
}

export default Severity
