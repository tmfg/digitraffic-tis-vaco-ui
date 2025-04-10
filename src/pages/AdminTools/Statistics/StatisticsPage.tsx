import StatisticsFigure from '../../../components/Statistics/StatisticsFigure.tsx'
import { useStatisticsFetch } from './hooks.ts'
import { useAcquireToken } from '../../../hooks/auth.ts'
import { useTranslation } from 'react-i18next'
import { AuthenticatedTemplate } from '@azure/msal-react'
import { StatResource } from '../../../types/Statistics.ts'
import { useEffect, useState } from 'react'

const StatisticsPage = () => {

  const [accessToken] = useAcquireToken()
  const [statusStats] = useStatisticsFetch(accessToken)
  const { t } = useTranslation()
  const [filteredStats30Days, setFilteredStats30Days] = useState<StatResource[] | null>(null);

  const isInLast30Days = (timestamp: string): boolean => {
    const today = new Date();
    const entryDate = new Date(timestamp);
    const diffTime = today.getTime() - entryDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 30;
  };

  useEffect(() => {
    if (statusStats) {
      const filtered30Days = statusStats.filter((entry: StatResource) =>
        isInLast30Days(entry.data.timestamp)
      )
      setFilteredStats30Days(filtered30Days);
    }

    }, [statusStats]);

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <div>
          <h1>{t('admin:statistics:header')}</h1>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1, }}>
              <StatisticsFigure stats={filteredStats30Days} />
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </div>
  )
}

export default StatisticsPage

