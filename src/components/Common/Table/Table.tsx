import './_table.scss'
import { Link } from 'react-router-dom'
import React, { useState, Fragment, useEffect, ReactNode } from 'react'
import { Map } from '../../../types/Map'
import ExpandSvg from '../../../assets/svg/plus.svg'
import HideSvg from '../../../assets/svg/minus.svg'
import SortComponent, { SortColumn } from './SortComponent'
import { sortTableAlphabetically, sortTableByDate, sortTableCustom, sortTableNumerically } from '../../../util/sort'
import FilterComponent from './FilterComponent'
import { getUniqueValues } from '../../../util/array'
import { useTranslation } from 'react-i18next'

export interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
  rowExpandable?: boolean
  expandables?: ExpandableContentProps
  defaultSortedColumn?: SortColumn
  isFixedLayout?: boolean
  paginationProps?: TablePaginationProps
  resetCallback?: (newCount: number) => void
  isHalfWide?: boolean
}

export interface ExpandableContent {
  rowIdentifierValue: string
  content: React.ReactNode
}

export interface ExpandableContentProps {
  rowExpandableIdentifierName: string // name of row's column that identifies the row
  rowExpandableContents: ExpandableContent[]
}

export interface TablePaginationProps {
  itemOffset: number
  endOffset: number
}

export interface TableItem {
  name: string
  value: string | React.ReactNode | number | undefined
  href?: string
  plainValue?: string | number | boolean | null
  colSpan?: number
  isCode?: boolean
  textAlign?: string
}

export interface HeaderItem {
  name: string
  value: string
  sortable?: boolean
  filterable?: boolean
  type?: string
  sortByCustomOrder?: ((row: TableItem[]) => number) | undefined
  colSpan?: number
  customStyle?: Map
  filterDropdownMenuAlignLeft?: string
  textAlign?: string
}

export const getTableItemByColumnName = (row: TableItem[], columnName: string): TableItem => {
  return row.filter((item) => item.name === columnName)[0]
}

const Table = ({
  rows,
  headerItems,
  tableTitle,
  rowExpandable = false,
  expandables,
  defaultSortedColumn,
  isFixedLayout = false,
  paginationProps,
  resetCallback,
  isHalfWide = false
}: TableProps) => {
  const [rowsExpandedState, setRowsExpandedState] = useState<Map>({})
  const [selectedSortColumn, setSelectedSortColumn] = useState<SortColumn | undefined>(defaultSortedColumn)
  const [shownRows, setShownRows] = useState<TableItem[][]>(rows)
  const [selectedFilters, setSelectedFilters] = useState<Map>()
  const { t } = useTranslation()

  /**
   * This is important also re-rendering the content if
   * e.g. user searches through it
   * or if for whatever random reason the parent component decides to re-render
   */
  useEffect(() => {

    let newRows = rows
    if (selectedFilters) {
      newRows = getFilteredRows(rows, selectedFilters)
    }

    if (selectedSortColumn) {
      newRows = getOrderedRows(newRows, selectedSortColumn)
    }
    setRowsExpandedState({})
    setShownRows(newRows)
    // Important at this point to reset the number of pages, if table is wrapped with pagination
    // For example, if there were filters applied but then user entered some search word and the rows have changed by that
    resetCallback && resetCallback(newRows.length)
  }, [resetCallback, rows, selectedFilters, selectedSortColumn])

  useEffect(() => {
    if (paginationProps) {
      setRowsExpandedState({})
    }
  }, [paginationProps])

  const sortCallback = (newSortColumn: SortColumn) => {
    setSelectedSortColumn(newSortColumn)
    const orderedRows = getOrderedRows([...shownRows], newSortColumn)
    setRowsExpandedState({})
    if (orderedRows) {
      setShownRows(orderedRows)
    }
    resetCallback && resetCallback(shownRows.length)
  }

  const getOrderedRows = (currentShownRows: TableItem[][], newSortColumn: SortColumn): TableItem[][] => {
    if (!newSortColumn) {
      return currentShownRows
    }
    if (newSortColumn.type === 'string') {
      return sortTableAlphabetically(currentShownRows, newSortColumn.name, newSortColumn.direction)
    } else if (newSortColumn.type === 'numeric') {
      return sortTableNumerically(currentShownRows, newSortColumn.name, newSortColumn.direction)
    } else if (newSortColumn.type === 'custom' && newSortColumn.sortByCustomOrder) {
      return sortTableCustom(currentShownRows, newSortColumn.direction, newSortColumn.sortByCustomOrder)
    } else if (newSortColumn.type === 'date') {
      return sortTableByDate(currentShownRows, newSortColumn.name, newSortColumn.direction)
    } else {
      return currentShownRows
    }
  }

  const getFilteredRows = (newRows: TableItem[][], newFilteringState: Map): TableItem[][] => {
    return newRows.filter((row) => {
      const filterColumns = Object.keys(newFilteringState)
      return filterColumns.reduce((accumulator, filterColumn) => {
        const columnFilters = newFilteringState[filterColumn] as string[]
        const columnValue = row.filter((col) => col.name === filterColumn)[0].plainValue as string
        const canColumnBeShown = !columnFilters || columnFilters.length === 0 || columnFilters.includes(columnValue)
        return accumulator && canColumnBeShown
      }, true)
    })
  }

  const filterCallback = (selectedFilterOptions: string[], columnName: string) => {
    const newFilteringState: Map = { ...selectedFilters }
    newFilteringState[columnName] = selectedFilterOptions
    setSelectedFilters(newFilteringState)

    let newRows = getFilteredRows(rows, newFilteringState)
    if (selectedSortColumn) {
      newRows = getOrderedRows(newRows, selectedSortColumn)
    }
    setRowsExpandedState({})
    setShownRows(newRows)
    resetCallback && resetCallback(newRows.length)
  }

  const getHeader = () => {
    return headerItems.map((column) => (
      <th
        key={tableTitle + '-header-' + column.name}
        colSpan={column.colSpan ?? 1}
        className={`${defaultSortedColumn ? 'th-sortable' : ''} ${
          column.textAlign === 'right' ? 'text-aligned-right' : ''
        }`}
        style={column.customStyle ?? {}}
      >
        <span style={{ marginRight: '0.25rem' }}>{column.value}</span>
        {column.sortable && (
          <SortComponent
            tableTitle={tableTitle}
            sortCallback={sortCallback}
            selectedSortedColumn={selectedSortColumn}
            column={column}
          />
        )}
        {column.filterable && (
          <FilterComponent
            column={column}
            tableTitle={tableTitle}
            filterOptions={getUniqueValues(
              rows.map((row) => row.filter((col) => col.name === column.name)[0].plainValue as string)
            )}
            selectedFilterOptions={selectedFilters ? (selectedFilters[column.name] as string[]) : []}
            filterCallback={(selectedFilterOptions: string[]) => {
              filterCallback(selectedFilterOptions, column.name)
            }}
          />
        )}
      </th>
    ))
  }

  const getBody = () => {
    if (!shownRows) {
      return
    }
    const finalRows =
      paginationProps && Object.keys(paginationProps).length > 0
        ? shownRows.slice(paginationProps.itemOffset, paginationProps.endOffset)
        : shownRows
    return finalRows.map((row, i) => {
      const rowIdentifyingValue: string | undefined = getExpandableRowIdentifyingValue(row)
      return (
        <Fragment key={tableTitle + '-fragment-row-' + i}>
          <tr
            key={tableTitle + '-row-' + i}
            className={`${rowExpandable ? 'row-expandable' : ''} ${
              rowIdentifyingValue && rowsExpandedState[rowIdentifyingValue] ? 'row-expanded' : ''
            }`}
            onClick={() => {
              if (!rowExpandable || !rowIdentifyingValue) {
                return
              }
              const newRowsExpandedState = { ...rowsExpandedState }
              newRowsExpandedState[rowIdentifyingValue] = !rowsExpandedState[rowIdentifyingValue]
              setRowsExpandedState(newRowsExpandedState)
            }}
          >
            {getRow(row, i)}
          </tr>
          {rowIdentifyingValue &&
            rowsExpandedState[rowIdentifyingValue] &&
            rowExpandable &&
            expandables?.rowExpandableContents && (
              <tr className={'expanded-content-container'}>{getExpandableContent(rowIdentifyingValue)}</tr>
            )}
        </Fragment>
      )
    })
  }

  const getExpandableRowIdentifyingValue = (row: TableItem[]) => {
    if (!expandables) {
      return
    }
    return row.filter((col) => col.name === expandables.rowExpandableIdentifierName)[0].plainValue as string
  }

  const getExpandableContent = (rowIdentifyingValue: string): ReactNode => {
    if (!expandables) {
      return
    }
    return expandables?.rowExpandableContents.filter(
      (expandable) => expandable.rowIdentifierValue === rowIdentifyingValue
    )[0].content
  }

  const getRow = (row: TableItem[], rowIndex: number) => {
    return row.map((item, columnIndex) =>
      rowExpandable && columnIndex == 0
        ? getFirstTdInExpandableRow(item, rowIndex, columnIndex)
        : getTd(item, rowIndex, columnIndex)
    )
  }

  const getTd = (item: TableItem, rowNumber: number, columnIndex: number) => {
    return (
      <td
        className={`${item.isCode ? 'code' : ''} ${item.textAlign === 'right' ? 'text-aligned-right' : ''}`}
        colSpan={item.colSpan ?? 1}
        key={tableTitle + 'row-' + rowNumber + '-column-' + columnIndex + '-' + item.name}
      >
        {item.href ? (
          <Link key={tableTitle + 'row-link' + rowNumber + item.name} to={item.href}>
            {item.value}
          </Link>
        ) : (
          item.value
        )}
      </td>
    )
  }

  const getFirstTdInExpandableRow = (item: TableItem, rowIndex: number, columnIndex: number) => {
    return (
      <td colSpan={item.colSpan ?? 1} key={tableTitle + 'row-' + rowIndex + '-column-' + columnIndex + '-' + item.name}>
        <div className={'expandable-column'}>
          <span className={'expanded-icon'}>
            {rowsExpandedState[tableTitle + '-row-' + rowIndex] ? <HideSvg /> : <ExpandSvg />}
          </span>
          <span>{item.value}</span>
        </div>
      </td>
    )
  }

  const calculateTotalColspan = () => {
    return headerItems.map((headerItem) => headerItem.colSpan || 1).reduce((acc, colspan) => acc + colspan, 0)
  }

  const getNoResults = () => {
    const totalColspan = calculateTotalColspan()
    return (
      <tr>
        <td
          colSpan={totalColspan}
          style={{ paddingTop: '1.5rem', textAlign: 'center', fontStyle: 'italic', color: '#555555' }}
        >
          {t('services:myData:noResultsFound')}
        </td>
      </tr>
    )
  }

  return (
    <div className={'table-wrapper '}>
      <table className={`${isFixedLayout ? 'table-fixed' : ''} ${isHalfWide ? 'half-wide' : ''}`}>
        <thead>
          <tr>{getHeader()}</tr>
        </thead>
        <tbody>{shownRows && shownRows.length > 0 ? getBody() : getNoResults()}</tbody>
      </table>
    </div>
  )
}

export default React.memo(Table)
