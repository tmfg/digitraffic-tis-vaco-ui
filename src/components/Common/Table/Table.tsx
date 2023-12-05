import './_table.scss'
import { Link } from 'react-router-dom'

interface TableProps {
  tableTitle: string
  headerItems: HeaderItem[]
  rows: TableItem[][]
}

export interface TableItem {
  name: string
  value: string | number | boolean | undefined
  href?: string
}

export interface HeaderItem {
  name: string
  value: string
  sortColumn?: string
  filterable?: boolean
}

const Table = ({ rows, headerItems, tableTitle }: TableProps) => {
  const getHeader = () => {
    return headerItems.map((column) => <th key={tableTitle + '-header-' + column.name}>{column.value}</th>)
  }

  const getBody = () => {
    return rows.map((row, i) => <tr key={tableTitle + '-row-' + i}>{getRow(row, i)}</tr>)
  }

  const getRow = (row: TableItem[], i: number) => {
    return row.map((item) => getTd(item, i))
  }

  const getTd = (item: TableItem, i: number) => {
    return (
      <td className={item.href ? 'link' : ''} key={tableTitle + 'row-' + i + item.name}>
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
