import './_table.scss'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { Map } from '../../../types/Map'

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
  sortColumn?: string
  filterable?: boolean
}

const Table = ({ rows, headerItems, tableTitle, rowExpandable = false, rowExpandedContents }: TableProps) => {
  const [rowsExpandedState, setRowsExpandedState] = useState<Map>({})

  const getHeader = () => {
    return headerItems.map((column) => <th key={tableTitle + '-header-' + column.name}>{column.value}</th>)
  }

  console.log(rowExpandedContents)

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

  const getRow = (row: TableItem[], i: number) => {
    return row.map((item) => getTd(item, i))
  }

  const getTd = (item: TableItem, i: number) => {
    return (
      <td className={`${item.href ? 'link' : ''}`} key={tableTitle + 'row-' + i + item.name}>
        {item.href ? (
          <Link key={tableTitle + 'row-link' + i + item.name} to={item.href}>
            {item.value}
          </Link>
        ) : (
          item.value
        )}
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
