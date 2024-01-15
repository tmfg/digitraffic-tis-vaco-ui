import { ItemCounter } from '../../../types/ItemCounter'
import { useTranslation } from 'react-i18next'

interface ReportStatsProps {
  counters: ItemCounter[]
}

const FindingCounters = ({ counters }: ReportStatsProps) => {
  const { t } = useTranslation()

  return (
    <div className={'report-stats'}>
      {counters.map((item) => {
        return (
          <div key={'report-stats-' + item.name} className={`counter counter--${item.name}`}>
            <div className={`total ${item.total === 0 ? 'counter--SUCCESS' : ''}`}>{item.total}</div>
            <div className={'name'}>{t('services:processingResults:reportStats:' + item.name.toLowerCase())}</div>
          </div>
        )
      })}
    </div>
  )
}

export default FindingCounters
