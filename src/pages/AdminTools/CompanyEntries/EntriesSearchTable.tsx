import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Table, { HeaderItem, TableItem } from '../../../components/Common/Table/Table'
import { FdsButtonComponent } from '../../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../../components/fds/FdsInputComponent'
import '../_mydata.scss'
import '../../../components/Common/SearchPanel/_search-panel.scss'
import Pagination from '../../../components/Common/Pagination/Pagination'
import { EnvironmentContext } from '../../../EnvironmentProvider.tsx'
import VacoBadge from '../../../components/Common/VacoBadge/VacoBadge.tsx'
import LoadSpinner from '../../../components/Common/LoadSpinner/LoadSpinner'
import { useSearchInputListener } from '../../../hooks/searchInputListener'
import { EntrySummary } from '../../../types/EntryResource.ts'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from './helpers.ts'

interface EntriesSearchTableProps {
  /** Null until the entries are fetched, so that "not fetched yet" differs from "no entries" */
  entries: EntrySummary[] | null
  isFetchInProgress: boolean
  /** The search form and the "latest" heading show only when true */
  showSearch: boolean
  /** True when the entries do not exist, so that neither the table nor the empty message shows */
  hideEntries?: boolean
}

/** The search form and the table of the latest entries. */
const EntriesSearchTable = ({ entries, isFetchInProgress, showSearch, hideEntries = false }: EntriesSearchTableProps) => {
  const { t } = useTranslation()
  const bootstrap = useContext(EnvironmentContext)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const [searchWord] = useSearchInputListener(searchInputRef, entries)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)

  useEffect(() => {
    if (bootstrap && entries) {
      const entryRows: TableItem[][] = entries.map((entrySummary: EntrySummary) => {
        const row: TableItem[] = getTableRow(entrySummary, t)
        row.push({
          name: 'status',
          value: <VacoBadge bootstrap={bootstrap} publicId={entrySummary.publicId} />,
          plainValue: entrySummary.status.charAt(0).toUpperCase() + entrySummary.status.slice(1)
        })
        return row
      })
      setAllEntryRows(entryRows)
      setEntriesToShow(entryRows)
    }
  }, [entries, t, bootstrap])

  return (
    <>
      {showSearch && (
        <>
          <h4 style={{ marginTop: '2.5rem' }} className={'header-wrapper__small'}>
            {t('services:myData:find')}
          </h4>
          <div className={'search-panel'}>
            <form>
              <div id={'searchInput'} ref={searchInputRef} className={'search-input'}>
                <FdsInputComponent
                  clearable={true}
                  name={'searchWord'}
                  placeholder={t('services:myData:searchWordPlaceholder')}
                  label={t('services:myData:searchWord')}
                />
              </div>
              <div className={'search-button'}>
                <FdsButtonComponent
                  onClick={(e) => {
                    e.preventDefault()
                    setEntriesToShow(
                      searchWord && allEntryRows ? filterTableRowsBySearchWord(searchWord, allEntryRows) : allEntryRows
                    )
                  }}
                  label={t('common:search')}
                />
              </div>
            </form>
          </div>
          <h5 className={'header-wrapper__big'}>{t('services:myData:latest')}</h5>
        </>
      )}
      {isFetchInProgress && <LoadSpinner />}
      {!hideEntries && entriesToShow && entriesToShow.length > 0 && (
        <Pagination contentName={t('pagination:content:submissions')} tableTitle={'myData'} defaultItemsPerPage={25}>
          <Table
            tableTitle={'myData'}
            headerItems={headerItems}
            rows={entriesToShow}
            isFixedLayout={true}
            defaultSortedColumn={{ name: 'dateCreated', direction: 'DESC', type: 'date' }}
          />
        </Pagination>
      )}
      {!hideEntries && allEntryRows && entriesToShow?.length === 0 && <div>{t('services:myData:noDataFound')}</div>}
    </>
  )
}

export default EntriesSearchTable
