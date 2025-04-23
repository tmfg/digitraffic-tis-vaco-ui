import EntryStatisticsFigure from '../../../components/Statistics/EntryStatisticsFigure.tsx'
import { useStatisticsFetch } from './hooks.ts'
import { useAcquireToken } from '../../../hooks/auth.ts'
import { useTranslation } from 'react-i18next'
import { AuthenticatedTemplate } from '@azure/msal-react'
import EntryInputStatisticsFigure from '../../../components/Statistics/EntryInputStatisticsFigure.tsx'
import Table, { HeaderItem, TableItem } from '../../../components/Common/Table/Table.tsx'
import { useEffect, useState } from 'react'
import { StatResource } from '../../../types/Statistics.ts'
import TaskStatisticsFigure from '../../../components/Statistics/TaskStatisticsFigure.tsx'
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

      const taskFilteredRows = Object.entries(todayTaskStats).map(([name, count]) => ([
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
      const entryFilteredRows = Object.entries(todayEntryStatusStats).map(([statusName, count]) => ([
        {
          name: 'status',
          value: statusName,
          colSpan: 1,
          plainValue: statusName
        },
        {
          name: 'count',
          value: count,
          colSpan: 1,
          plainValue: count
        }
      ]));

      const inputFilteredRowsFilteredRows = Object.entries(todayInputFormatStats).map(([name, count]) => ([
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

      setEntryRowItems(entryFilteredRows);
      setTaskRowItems(taskFilteredRows)
      setInputRowItems(inputFilteredRowsFilteredRows)
    }
  }, [entryStatusStats, taskStatusStats]);

  const GroupDataByName = (stats: StatResource[]) => {

    if (stats) {
      return stats.reduce((allForDay, oneStat) => {
        const dateStr = oneStat.data.timestamp
        allForDay[dateStr] = allForDay[dateStr] || {}
        allForDay[dateStr][oneStat.data.name] = (allForDay[dateStr][oneStat.data.name] || 0) + oneStat.data.count
        return allForDay
      }, {} as Record<string, Record<string, number>>)
    }
    return {};
  }

  const GroupDataByStatus = (stats: StatResource[]) => {
    if (stats) {
      return stats.reduce((allForDay, oneStat) => {
        const dateStr = oneStat.data.timestamp;
        allForDay[dateStr] = allForDay[dateStr] || {};
        allForDay[dateStr][oneStat.data.status] = (allForDay[dateStr][oneStat.data.status] || 0) + oneStat.data.count;
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
              <EntryStatisticsFigure groupedData={entryStatusGroupedData}/>
              <TaskStatisticsFigure groupedData={taskGroupedData}/>
              <EntryInputStatisticsFigure groupedData={entryInputGroupedData} />
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </div>
  )
}

export default StatisticsPage

