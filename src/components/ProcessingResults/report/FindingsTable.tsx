import { AggregatedFinding } from '../../../types/EntryStateResource'
import { useTranslation } from 'react-i18next'
import { getNoticesTableHeaders } from './helpers'
import Table, { ExpandableContent, HeaderItem, TableItem } from '../../Common/Table/Table'
import FindingDetails from './FindingDetails'
import Pagination from '../../Common/Pagination/Pagination'
import Severity from './Severity'

interface FindingsTableProps {
  aggregatedFindings: AggregatedFinding[]
  taskName: string
}

const FindingsTable = ({ aggregatedFindings, taskName }: FindingsTableProps) => {
  const { t } = useTranslation()
  const headerItems: HeaderItem[] = getNoticesTableHeaders(t)

  const aggregatedFindingsRowItems: TableItem[][] = aggregatedFindings.map((aggregatedFinding: AggregatedFinding) => {
    return [
      {
        name: 'code',
        value: aggregatedFinding.code,
        plainValue: aggregatedFinding.code,
        colSpan: 3
      },
      {
        name: 'severity',
        value: <Severity finding={aggregatedFinding} />,
        plainValue: t('services:processingResults:severity:' + aggregatedFinding.severity.toLowerCase()),
        colSpan: 2
      },
      {
        name: 'total',
        value: aggregatedFinding.total
      }
    ]
  })

  const expandables: ExpandableContent[] = aggregatedFindings.map((aggregatedFinding: AggregatedFinding) => {
    return {
      rowIdentifierValue: aggregatedFinding.code,
      content: (
        <FindingDetails
          key={'notice-details-' + aggregatedFinding.code}
          taskName={taskName}
          aggregatedFinding={aggregatedFinding}
        />
      )
    }
  })

  return (
    <Pagination
      contentName={t('pagination:content:notices')}
      tableTitle={'AggregatedFindingsTable-' + taskName}
      defaultItemsPerPage={10}
    >
      <Table
        tableTitle={'AggregatedFindingsTable-' + taskName}
        headerItems={headerItems}
        rows={aggregatedFindingsRowItems}
        rowExpandable={true}
        expandables={{
          rowExpandableIdentifierName: 'code',
          rowExpandableContents: expandables
        }}
        defaultSortedColumn={{ name: 'severity', direction: 'DESC', type: 'custom' }}
        isFixedLayout={true}
      />
    </Pagination>
  )
}

export default FindingsTable
