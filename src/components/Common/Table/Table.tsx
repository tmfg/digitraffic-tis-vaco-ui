import './_table.scss'
import { Link } from 'react-router-dom'
import React, { useState, Fragment } from 'react'
import { Map } from '../../../types/Map'
import { ReactComponent as ExpandSvg } from '../../../assets/svg/plus.svg'
import { ReactComponent as HideSvg } from '../../../assets/svg/minus.svg'
import SortComponent, { SortedColumn } from './SortComponent'
import { sortTableAlphabetically, sortTableCustom, sortTableNumerically } from '../../../util/sort'

interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
  rowExpandable?: boolean
  rowExpandedContents?: React.ReactNode[]
  defaultSortedColumn?: SortedColumn
}

export interface TableItem {
  name: string
  value: string | React.ReactNode | number | undefined
  href?: string
  plainValue?: string | number | boolean
}

export interface HeaderItem {
  name: string
  value: string
  sortable?: boolean
  filterable?: boolean
  type?: string
  sortQualifier?: ((row: TableItem[]) => number) | undefined
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
  defaultSortedColumn
}: TableProps) => {
  const [rowsExpandedState, setRowsExpandedState] = useState<Map>({})
  const [selectedSortColumn, setSelectedSortColumn] = useState<SortedColumn | undefined>(defaultSortedColumn)
  const [orderedRows, setOrderedRows] = useState<TableItem[][]>(rows)

  const onSelectSortColumn = (newSortColumn: SortedColumn) => {
    setSelectedSortColumn(newSortColumn)
    if (newSortColumn.type === 'string') {
      setOrderedRows(sortTableAlphabetically(rows, newSortColumn.name, newSortColumn.direction))
    } else if (newSortColumn.type === 'numeric') {
      setOrderedRows(sortTableNumerically(rows, newSortColumn.name, newSortColumn.direction))
    } else if (newSortColumn.sortQualifier) {
      setOrderedRows(sortTableCustom(rows, newSortColumn.direction, newSortColumn.sortQualifier))
    }
  }

  const getHeader = () => {
    return headerItems.map((column, index) => (
      <th key={tableTitle + '-header-' + column.name} className={defaultSortedColumn ? 'th-sortable' : ''}>
        <span style={{ marginRight: '0.5rem' }}>{column.value}</span>
        {column.sortable && (
          <SortComponent
            tableTitle={tableTitle}
            onSelectSortColumn={onSelectSortColumn}
            selectedSortedColumn={selectedSortColumn}
            column={column}
            isLastColumn={index === headerItems.length - 1}
          />
        )}
      </th>
    ))
  }

  const getBody = () => {
    return orderedRows.map((row, i) => (
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
      <td key={tableTitle + 'row-' + rowIndex + '-column-' + columnIndex + '-' + item.name}>
        <div>
          <span className={'expanded-icon'}>
            {rowsExpandedState[tableTitle + '-row-' + rowIndex] ? <HideSvg /> : <ExpandSvg />}
          </span>
          <span>{item.value}</span>
        </div>
      </td>
    )
  }

  return (
    <div className={'table-wrapper '}>
      <table>
        <thead>
          <tr>{getHeader()}</tr>
        </thead>
        <tbody>{getBody()}</tbody>
      </table>
    </div>
  )
}

export default Table
