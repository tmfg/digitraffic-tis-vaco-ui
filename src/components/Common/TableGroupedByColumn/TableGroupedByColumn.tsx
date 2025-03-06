import './_tableGroupedByColumn.scss'
import { Link } from 'react-router-dom'
import React, { useState, useEffect, JSX } from 'react'
import { Map } from '../../../types/Map'
import SortComponent, { SortColumn } from '../Table/SortComponent'
import { sortTableAlphabetically, sortTableByDate, sortTableCustom, sortTableNumerically } from '../../../util/sort'
import { useTranslation } from 'react-i18next'
import { HeaderItem, TableItem, TablePaginationProps } from '../Table/Table'
import FilterComponent from '../Table/FilterComponent.tsx'
import { getUniqueValues } from '../../../util/array'

export interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
  defaultSortedColumn?: SortColumn
  isFixedLayout?: boolean
  paginationProps?: TablePaginationProps
  resetCallback?: (newCount: number) => void
  columnsToGroup: string[]
  uniqueColumnToGroup: string
}

const TableGroupedByColumn = ({
  rows,
  headerItems,
  tableTitle,
  defaultSortedColumn,
  isFixedLayout = false,
  paginationProps,
  resetCallback,
  uniqueColumnToGroup,
  columnsToGroup
}: TableProps) => {
  const [selectedSortColumn, setSelectedSortColumn] = useState<SortColumn | undefined>(defaultSortedColumn)
  const [shownRows, setShownRows] = useState<TableItem[][]>(rows)
  const { t } = useTranslation()
  const [groupingUniqueValues, setGroupingUniqueValues] = useState<string[]>([])
  const [rowsMapByGroupingColumn, setRowsMapByGroupingColumn] = useState<Map>({})
  const [selectedFilters, setSelectedFilters] = useState<Map>()

  /**
   * This is important also re-rendering the content if
   * e.g. user searches through it
   * or if for whatever random reason the parent component decides to re-render
   */
  useEffect(() => {
    if (!selectedSortColumn) {
      return
    }

    let newRows = rows
    if (selectedFilters) {
      newRows = getFilteredRows(rows, selectedFilters)
    }
    if (selectedSortColumn) {
      newRows = getOrderedRows(newRows, selectedSortColumn)
    }
    setShownRows(newRows)

    const newRowsMapByGroupingColumn: Map = {}
    const newGroupingUniqueValues: string[] = []
    newRows.forEach((row) => {
      const groupingColumnValue = row.filter((col) => col.name === uniqueColumnToGroup)[0].plainValue as string
      if (!newGroupingUniqueValues.includes(groupingColumnValue)) {
        newGroupingUniqueValues.push(groupingColumnValue)
        newRowsMapByGroupingColumn[groupingColumnValue] = [row]
      } else {
        const mappedRows: TableItem[][] = newRowsMapByGroupingColumn[groupingColumnValue] as TableItem[][]
        mappedRows.push(row)
      }
    })
    setGroupingUniqueValues(newGroupingUniqueValues)
    setRowsMapByGroupingColumn(newRowsMapByGroupingColumn)
    // Important at this point to set the number of pages, if table is wrapped with pagination
    resetCallback && resetCallback(newGroupingUniqueValues.length)
  }, [resetCallback, rows, selectedFilters, selectedSortColumn])

  const sortCallback = (newSortColumn: SortColumn) => {
    setSelectedSortColumn(newSortColumn)
    const orderedRows = getOrderedRows([...shownRows], newSortColumn)
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
    setShownRows(newRows)
    resetCallback && resetCallback(newRows.length)
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
    const groupedRows: JSX.Element[][] = []
    const slicedGroupingUniqueValues =
      paginationProps && Object.keys(paginationProps).length > 0
        ? groupingUniqueValues.slice(paginationProps.itemOffset, paginationProps.endOffset)
        : groupingUniqueValues
    slicedGroupingUniqueValues.map((name) => {
      const rowsByName = rowsMapByGroupingColumn[name] as TableItem[][]
      const resultingTableRows = rowsByName.map((row, i) => {
        const isFirst = i === 0
        const isLast = i === rowsByName.length - 1
        const rowIdentifier = row.filter((col) => col.name === uniqueColumnToGroup)[0].plainValue as string
        return (
          <tr key={tableTitle + '-row-' + rowIdentifier + '-' + i}>{getRow(row, rowIdentifier, isFirst, isLast)}</tr>
        )
      })
      groupedRows.push(resultingTableRows)
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return groupedRows
  }

  const getRow = (row: TableItem[], rowIdentifier: string, isFirst: boolean, isLast: boolean) => {
    return row.map((item, columnIndex) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      isFirst || !columnsToGroup.includes(item.name)
        ? getTd(item, rowIdentifier, columnIndex, isLast)
        : getEmptyTd(item, rowIdentifier, columnIndex, isLast)
    )
  }

  const getEmptyTd = (item: TableItem, rowIdentifier: string, columnIndex: number, isLast: boolean) => {
    return (
      <td
        colSpan={item.colSpan ?? 1}
        className={`${isLast ? 'td-underlined' : ''}`}
        key={tableTitle + 'row-' + rowIdentifier + '-column-' + columnIndex + '-' + item.name}
      ></td>
    )
  }

  const getTd = (item: TableItem, rowIdentifier: string, columnIndex: number, isLast: boolean) => {
    return (
      <td
        colSpan={item.colSpan ?? 1}
        className={`${isLast ? 'td-underlined' : ''}`}
        key={tableTitle + 'row-' + rowIdentifier + '-column-' + columnIndex + '-' + item.name}
      >
        {item.href ? (
          <Link key={tableTitle + 'row-link' + rowIdentifier + item.name} to={item.href}>
            {item.value}
          </Link>
        ) : (
          item.value
        )}
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
      <table className={isFixedLayout ? 'table-fixed' : ''}>
        <thead>
          <tr>{getHeader()}</tr>
        </thead>
        <tbody>{shownRows && shownRows.length > 0 ? getBody() : getNoResults()}</tbody>
      </table>
    </div>
  )
}

export default React.memo(TableGroupedByColumn)
