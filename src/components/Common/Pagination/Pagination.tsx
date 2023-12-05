import React, { useState } from 'react'
import { TableItem } from '../Table/Table'

interface PaginationProps {
  itemsPerPage: number
  items: TableItem[][]
  children: React.ReactNode
  tableName: string
}

const Pagination = ({ itemsPerPage, items, children, tableName }: PaginationProps) => {
  const [itemOffset /*, setItemOffset*/] = useState(0)
  console.log(itemOffset)
  //const endOffset = itemOffset + itemsPerPage
  //const currentItems = items.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(items.length / itemsPerPage)
  const pageNumbers = [...Array(pageCount).keys()].map((i) => i + 1)

 /* const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`)
    setItemOffset(newOffset)
  }*/

  const getPageNumbers = () => {
    return pageNumbers.map((i) => (
      <span key={tableName + '-page-' + i}>
        <a>{i}</a>
      </span>
    ))
  }

  return (
    <div>
      {children}
      <div>previous {getPageNumbers()} next</div>
    </div>
  )
}

export default Pagination
