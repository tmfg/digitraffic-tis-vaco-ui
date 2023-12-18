import './_table.scss'
import { Link } from 'react-router-dom'
import React, { useState, Fragment } from 'react'
import { Map } from '../../../types/Map'
import { ReactComponent as ExpandSvg } from '../../../assets/svg/plus.svg'
import { ReactComponent as HideSvg } from '../../../assets/svg/minus.svg'
import SortComponent, { SortColumn } from './SortComponent'
import { sortTableAlphabetically, sortTableCustom, sortTableNumerically } from '../../../util/sort'
import FilterComponent from './FilterComponent'
import { getUniqueValues } from '../../../util/array'

interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
  rowExpandable?: boolean
  rowExpandedContents?: React.ReactNode[]
  defaultSortedColumn?: SortColumn
  isFixedLayout?: boolean
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
  isFixedLayout = false
}: TableProps) => {
  const [rowsExpandedState, setRowsExpandedState] = useState<Map>({})
  const [selectedSortColumn, setSelectedSortColumn] = useState<SortColumn | undefined>(defaultSortedColumn)
  const [shownRows, setShownRows] = useState<TableItem[][]>(rows)
  const [selectedFilters, setSelectedFilters] = useState<Map>()

  const sortCallback = (newSortColumn: SortColumn) => {
    setSelectedSortColumn(newSortColumn)
    orderRows([...shownRows], newSortColumn)
  }

  const orderRows = (currentShownRows: TableItem[][], newSortColumn: SortColumn) => {
    if (!newSortColumn) {
      return
    }
    if (newSortColumn.type === 'string') {
      setShownRows(sortTableAlphabetically(currentShownRows, newSortColumn.name, newSortColumn.direction))
    } else if (newSortColumn.type === 'numeric') {
      setShownRows(sortTableNumerically(currentShownRows, newSortColumn.name, newSortColumn.direction))
    } else if (newSortColumn.type === 'custom' && newSortColumn.sortByCustomOrder) {
      setShownRows(sortTableCustom(currentShownRows, newSortColumn.direction, newSortColumn.sortByCustomOrder))
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

    const newRows = getFilteredRows(newFilteringState)
    setShownRows(newRows)
    if (selectedSortColumn) {
      orderRows(newRows, selectedSortColumn)
    }
  }

  const getHeader = () => {
    return headerItems.map((column) => (
      <th
        key={tableTitle + '-header-' + column.name}
        colSpan={column.colSpan ?? 1}
        className={defaultSortedColumn ? 'th-sortable' : ''}
      >
        <span style={{ marginRight: '1rem' }}>{column.value}</span>
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
    return shownRows.map((row, i) => (
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
        <div>
          <span className={'expanded-icon'}>
            {rowsExpandedState[tableTitle + '-row-' + rowIndex] ? <HideSvg /> : <ExpandSvg />}
          </span>
          <span>{item.value}</span>
        </div>
      </td>
    )
  }

  const getNoFilterResults = () => {
    return (
      <tr>
        <td colSpan={6} style={{ paddingTop: '1.5rem', textAlign: 'center', fontStyle: 'italic', color: '#555555' }}>
          No results for selected filter values
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
        <tbody>{shownRows && shownRows.length > 0 ? getBody() : getNoFilterResults()}</tbody>
      </table>
    </div>
  )
}

export default Table
