import './_dataDelivery.scss'
import { useCallback, useEffect, useState } from 'react'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { FdsInputComponent } from '../fds/FdsInputComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from './helpers'
import { HeaderItem, TableItem } from '../Common/Table/Table'
import { useTranslation } from 'react-i18next'
import { CompanyLatestEntryResource } from '../../types/DataDelivery'
import Pagination from '../Common/Pagination/Pagination'
import TableGroupedByColumn from '../Common/TableGroupedByColumn/TableGroupedByColumn'

interface DataDeliveryProps {
  data: CompanyLatestEntryResource[] | null
}

const DataDeliveryView = ({ data }: DataDeliveryProps) => {
  const { t } = useTranslation()
  const [searchWord, setSearchWord] = useState<string | null>(null)
  const [allRows, setAllRows] = useState<TableItem[][] | null>(null)
  const [rowsToShow, setRowsToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)

  useEffect(() => {
    if (data) {
      const rows: TableItem[][] = data.map((latestCompanyEntry: CompanyLatestEntryResource) => {
        const row: TableItem[] = getTableRow(latestCompanyEntry, t)
        const finalRow: TableItem[] = row.slice(0, 5)
        if (latestCompanyEntry.data.status && latestCompanyEntry.links.refs.badge) {
          finalRow.push({
            name: 'status',
            value: <img alt={'badge'} src={latestCompanyEntry.links.refs.badge.href} />,
            plainValue: latestCompanyEntry.data.status.charAt(0).toUpperCase() + latestCompanyEntry.data.status.slice(1)
          })
        } else {
          finalRow.push({
            name: 'status',
            value: '',
            plainValue: ''
          })
        }
        finalRow.push(row[row.length - 1])
        return finalRow
      })
      setAllRows(rows)
      setRowsToShow(rows)
    }
  }, [data, t])

  const useInputListener: EventListenerOrEventListenerObject = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as FdsInputChange
    setSearchWord(detail.value as string)
  }, [])

  useEffect(() => {
    const searchElement = document.querySelector('[id="searchInput"]')
    if (searchElement && searchElement.getAttribute('listener') !== 'true') {
      searchElement.addEventListener('change', useInputListener)
    }

    return () => {
      searchElement?.removeEventListener('change', useInputListener)
    }
  }, [useInputListener])

  return (
    <>
      <div className={'searchLatestEntries'}>
        <form>
          <div id={'searchInput'} className={'search-input'}>
            <FdsInputComponent
              clearable={true}
              name={'searchWord'}
              placeholder={t('admin:dataDelivery:searchWordPlaceholder')}
              label={t('services:myData:searchWord')}
            />
          </div>
          <div className={'search-button'}>
            <FdsButtonComponent
              onClick={(e) => {
                e.preventDefault()
                setRowsToShow(searchWord && allRows ? filterTableRowsBySearchWord(searchWord, allRows) : allRows)
              }}
              label={t('common:search')}
            />
          </div>
        </form>
      </div>
      {!allRows && ''}
      <h5 className={'header-wrapper__big'}></h5>
      {rowsToShow && rowsToShow.length > 0 && (
        <Pagination
          contentName={t('pagination:content:companies')}
          tableTitle={'dataDeliveryView'}
          defaultItemsPerPage={25}
        >
          <TableGroupedByColumn
            tableTitle={'dataDeliveryView'}
            headerItems={headerItems}
            rows={rowsToShow}
            isFixedLayout={true}
            defaultSortedColumn={{ name: 'companyName', direction: 'ASC', type: 'string' }}
            uniqueColumnToGroup={'businessId'}
            columnsToGroup={['companyName', 'businessId']}
          />
        </Pagination>
      )}
      {allRows && rowsToShow && rowsToShow.length === 0 && <div>{t('services:myData:noDataFound')}</div>}
    </>
  )
}

export default DataDeliveryView