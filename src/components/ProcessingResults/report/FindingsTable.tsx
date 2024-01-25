import { AggregatedFinding } from '../../../types/EntryStateResource'
import { useTranslation } from 'react-i18next'
import { getNoticesTableHeaders } from './helpers'
import Table, { ExpandableContent, HeaderItem, TableItem } from '../../Common/Table/Table'
import { ReactComponent as ErrorSvg } from '../../../assets/svg/error.svg'
import { ReactComponent as WarningSvg } from '../../../assets/svg/warning.svg'
import { ReactComponent as InfoSvg } from '../../../assets/svg/info.svg'
import FindingDetails from './FindingDetails'
import Pagination from '../../Common/Pagination/Pagination'

interface FindingsTableProps {
  aggregatedFindings: AggregatedFinding[]
  ruleName: string
}

const FindingsTable = ({ aggregatedFindings, ruleName }: FindingsTableProps) => {
  const { t } = useTranslation()
  const headerItems: HeaderItem[] = getNoticesTableHeaders(t)

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
      default:
        return <InfoSvg />
    }
  }

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
        value: (
          <div className={aggregatedFinding.severity}>
            {getSeverityIcon(aggregatedFinding.severity)} {'  '}
            <span className={aggregatedFinding.severity + '--text'} style={{ marginLeft: '5px' }}>
              {t('services:processingResults:severity:' + aggregatedFinding.severity.toLowerCase())}
            </span>
          </div>
        ),
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
          ruleName={ruleName}
          aggregatedFinding={aggregatedFinding}
        />
      )
    }
  })

  return (
    <Pagination
      itemsTotalCount={aggregatedFindingsRowItems.length}
      contentName={t('pagination:content:notices')}
      tableTitle={'AggregatedFindingsTable-' + ruleName}
      defaultItemsPerPage={10}
    >
      <Table
        tableTitle={'AggregatedFindingsTable-' + ruleName}
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
