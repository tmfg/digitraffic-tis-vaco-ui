import './_table.scss'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { Map } from '../../../types/Map'
import { ReactComponent as ExpandSvg } from '../../../assets/svg/plus.svg'
import { ReactComponent as HideSvg } from '../../../assets/svg/minus.svg'
//import { ReactComponent as SortAscSvg } from '../../../assets/svg/sort_asc.svg'
//import { ReactComponent as SortDescSvg } from '../../../assets/svg/sort_desc.svg'

interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
  rowExpandable?: boolean
  rowExpandedContents?: React.ReactNode[]
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
}

const Table = ({ rows, headerItems, tableTitle, rowExpandable = false, rowExpandedContents }: TableProps) => {
  const [rowsExpandedState, setRowsExpandedState] = useState<Map>({})

  const getHeader = () => {
    return headerItems.map((column) => (
      <th key={tableTitle + '-header-' + column.name}>
        <span>{column.value}</span>
      </th>
    ))
  }

  const getBody = () => {
    return rows.map((row, i) => (
      <>
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
      </>
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
