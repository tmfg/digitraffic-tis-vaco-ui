import { entryStatusConfig, InputFormatConfig, taskStatusConfig, useStatisticsFetch } from './hooks.ts'
import { useAcquireToken } from '../../../hooks/auth.ts'
import { useTranslation } from 'react-i18next'
import { AuthenticatedTemplate } from '@azure/msal-react'
import Table, { HeaderItem, TableItem } from '../../../components/Common/Table/Table.tsx'
import { useEffect, useState } from 'react'
import { StatusStatistics } from '../../../types/Statistics.ts'
import StatisticsFigure from '../../../components/Statistics/StatisticsFigure.tsx'
import Section from '../../../components//Common/Section/Section.tsx'

const StatisticsPage = () => {

  const [accessToken] = useAcquireToken()
  const [entryStatusStats, taskStatusStats] = useStatisticsFetch(accessToken)
  const { t } = useTranslation()
  const [entryRowItems, setEntryRowItems] = useState<TableItem[][]>([])
  const [taskRowItems, setTaskRowItems] = useState<TableItem[][]>([])
  const [inputRowItems, setInputRowItems] = useState<TableItem[][]>([])
  const [entryInputGroupedData, setEntryInputGroupedData] = useState<Record<string, Record<string, number>>>({});
  const [taskGroupedData, setTaskGroupedData] = useState<Record<string, Record<string, number>>>({});
  const [entryStatusGroupedData, setEntryStatusGroupedData] = useState<Record<string, Record<string, number>>>({});

  const statusHeaderItems:HeaderItem[] = [
    {
      name: 'status',
      value: t('admin:statistics:summary:EntryStatus')
    },
    {
      name: 'count',
      value: t('admin:statistics:summary:count')
    }
  ]

  const taskHeaderItems:HeaderItem[] = [
    {
      name: 'name',
      value: t('admin:statistics:summary:TaskName')
    },
    {
      name: 'count',
      value: t('admin:statistics:summary:count')
    }
  ]

  const InputFormatHeaderItems:HeaderItem[] = [
    {
      name: 'name',
      value: t('admin:statistics:summary:InputFormatName')
    },
    {
      name: 'count',
      value: t('admin:statistics:summary:count')
    }
  ]

  useEffect(() => {
    if (entryStatusStats && taskStatusStats) {

      const inputFormatGroupedData = GroupDataByName(entryStatusStats)
      setEntryInputGroupedData(inputFormatGroupedData);
      const taskGroupedData = GroupDataByName(taskStatusStats)
      setTaskGroupedData(taskGroupedData)
      const entryGroupedData = GroupDataByStatus(entryStatusStats)
      setEntryStatusGroupedData(entryGroupedData)

      const today = new Date().toISOString().split('T')[0];
      const todayTaskStats = taskGroupedData[today] || {};
      const todayInputFormatStats = inputFormatGroupedData[today] || {};
      const todayEntryStatusStats = entryGroupedData[today] || {};

      const taskFilteredRows = TableRows(todayTaskStats);
      const inputFilteredRows = TableRows(todayInputFormatStats);
      const entryFilteredRows = TableRows(todayEntryStatusStats)

      setEntryRowItems(entryFilteredRows);
      setTaskRowItems(taskFilteredRows)
      setInputRowItems(inputFilteredRows)
    }
  }, [entryStatusStats, taskStatusStats]);

  const TableRows = (todayStats:  Record<string, number>) => {
    return Object.entries(todayStats).map(([name, count]) => ([
      {
        name: 'name',
        value: name,
        colSpan: 1,
        plainValue: name
      },
      {
        name: 'count',
        value: count,
        colSpan: 1,
        plainValue: count
      }
    ]));
  }

  const GroupDataByName = (stats: StatusStatistics[]) => {
    if (stats) {
      return stats.reduce((allForDay, oneStat) => {
        const dateStr = oneStat.timestamp
        allForDay[dateStr] = allForDay[dateStr] || {}
        allForDay[dateStr][oneStat.name] = (allForDay[dateStr][oneStat.name] || 0) + oneStat.count
        return allForDay
      }, {} as Record<string, Record<string, number>>)
    }
    return {};
  }

  const GroupDataByStatus = (stats: StatusStatistics[]) => {
    if (stats) {
      return stats.reduce((allForDay, oneStat) => {
        const dateStr = oneStat.timestamp;
        allForDay[dateStr] = allForDay[dateStr] || {};
        allForDay[dateStr][oneStat.status] = (allForDay[dateStr][oneStat.status] || 0) + oneStat.count;
        return allForDay;
      }, {} as Record<string, Record<string, number>>);
    }
    return {};
  }

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <div>
          <h1>{t('admin:statistics:header')}</h1>
          <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <Section titleKey={t('admin:statistics:summary:todayStatusHeader')} hidable={true}>
              <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: 1, maxWidth: '33%', marginBottom: '20px' }}>
                  <Table
                    tableTitle={'statistics'}
                    headerItems={statusHeaderItems}
                    rows={entryRowItems}
                    isHalfWide={true}
                  />
                </div>
                <div style={{ flex: 1, maxWidth: '33%', marginBottom: '20px' }}>
                  <Table
                    tableTitle={'taskStatistics'}
                    headerItems={taskHeaderItems}
                    rows={taskRowItems}
                    isHalfWide={true}
                  />
                </div>
                <div style={{ flex: 1, maxWidth: '33%', marginBottom: '20px' }}>
                  <Table
                    tableTitle={'inputStatistics'}
                    headerItems={InputFormatHeaderItems}
                    rows={inputRowItems}
                    isHalfWide={true}
                  />
                </div>
              </div>
              </Section>
              <Section titleKey={t(entryStatusConfig.header)} hidable={true}>
                <StatisticsFigure groupedData={entryStatusGroupedData} config={entryStatusConfig} isOpen={true}/>
              </Section>
              <Section titleKey={t(taskStatusConfig.header)} hidable={true}>
                <StatisticsFigure groupedData={taskGroupedData} config={taskStatusConfig} isOpen={true}/>
              </Section>
              <Section titleKey={t(InputFormatConfig.header)} hidable={true}>
                <StatisticsFigure groupedData={entryInputGroupedData} config={InputFormatConfig} isOpen={true}/>
              </Section>
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </div>
  )
}

export default StatisticsPage

