import './_table.scss'
import { Link } from 'react-router-dom'
import React, { useState, Fragment, useEffect } from 'react'
import { Map } from '../../../types/Map'
import { ReactComponent as ExpandSvg } from '../../../assets/svg/plus.svg'
import { ReactComponent as HideSvg } from '../../../assets/svg/minus.svg'
import SortComponent, { SortColumn } from './SortComponent'
import { sortTableAlphabetically, sortTableByDate, sortTableCustom, sortTableNumerically } from '../../../util/sort'
import FilterComponent from './FilterComponent'
import { getUniqueValues } from '../../../util/array'

export interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
  rowExpandable?: boolean
  rowExpandedContents?: React.ReactNode[]
  defaultSortedColumn?: SortColumn
  isFixedLayout?: boolean
  paginationProps?: TablePaginationProps
}

export interface TablePaginationProps {
  itemOffset: number
  endOffset: number
  resetCallback: (newCount: number) => void
}

export interface TableItem {
  name: string
  value: string | React.ReactNode | number | undefined
  href?: string
  plainValue?: string | number | boolean
  colSpan?: number
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
}

export const getTableItemByColumnName = (row: TableItem[], columnName: string): TableItem => {
  return row.filter((item) => item.name === columnName)[0]
}

const Table = ({
  rows,
  headerItems,
  tableTitle,
  rowExpandable = false,
  rowExpandedContents,
  defaultSortedColumn,
  isFixedLayout = false,
  paginationProps
}: TableProps) => {
  const [rowsExpandedState, setRowsExpandedState] = useState<Map>({})
  const [selectedSortColumn, setSelectedSortColumn] = useState<SortColumn | undefined>(defaultSortedColumn)
  const [shownRows, setShownRows] = useState<TableItem[][]>(rows)
  const [selectedFilters, setSelectedFilters] = useState<Map>()

  useEffect(() => {
    let newRows = rows
    if (selectedFilters) {
      newRows = getFilteredRows(selectedFilters)
    }

    if (selectedSortColumn) {
      newRows = getOrderedRows([...newRows], selectedSortColumn)
    }

    setShownRows(newRows)
    paginationProps?.resetCallback(shownRows.length)
  }, [rows])

  const sortCallback = (newSortColumn: SortColumn) => {
    setSelectedSortColumn(newSortColumn)
    const orderedRows = getOrderedRows([...shownRows], newSortColumn)
    if (orderedRows) {
      setShownRows(orderedRows)
    }
    paginationProps?.resetCallback(shownRows.length)
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

  const getFilteredRows = (newFilteringState: Map) => {
    return rows.filter((row) => {
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

    let newRows = getFilteredRows(newFilteringState)
    if (selectedSortColumn) {
      newRows = getOrderedRows(newRows, selectedSortColumn)
    }
    setShownRows(newRows)
    paginationProps?.resetCallback(newRows.length)
  }

  const getHeader = () => {
    return headerItems.map((column) => (
      <th
        key={tableTitle + '-header-' + column.name}
        colSpan={column.colSpan ?? 1}
        className={defaultSortedColumn ? 'th-sortable' : ''}
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
    return finalRows.map((row, i) => (
      <Fragment key={tableTitle + '-fragment-row-' + i}>
        <tr
          key={tableTitle + '-row-' + i}
          className={`${rowExpandable ? 'row-expandable' : ''} ${
            rowsExpandedState[tableTitle + '-row-' + i] ? 'row-expanded' : ''
          }`}
          onClick={() => {
            if (!rowExpandable) {
              return
            }
            const newRowsExpandedState = { ...rowsExpandedState }
            newRowsExpandedState[tableTitle + '-row-' + i] = !rowsExpandedState[tableTitle + '-row-' + i]
            setRowsExpandedState(newRowsExpandedState)
          }}
        >
          {getRow(row, i)}
        </tr>
        {rowsExpandedState[tableTitle + '-row-' + i] && rowExpandedContents && (
          <tr className={'expanded-content-container'}>{rowExpandedContents[i]}</tr>
        )}
      </Fragment>
    ))
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
        colSpan={item.colSpan ?? 1}
        className={`${item.href ? 'link' : ''}`}
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

  const getNoResults = () => {
    return (
      <tr>
        <td colSpan={6} style={{ paddingTop: '1.5rem', textAlign: 'center', fontStyle: 'italic', color: '#555555' }}>
          No results found
        </td>
      </tr>
    )
  }

  return (
    <div className={'table-wrapper '}>
      <table className={isFixedLayout ? 'table-fixed' : ''}>
        <thead>
          <tr>{getHeader()}</tr>
        </thead>
        <tbody>{shownRows && shownRows.length > 0 ? getBody() : getNoResults()}</tbody>
      </table>
    </div>
  )
}

export default Table
