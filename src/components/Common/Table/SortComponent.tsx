import './_sort.scss'
import { ReactComponent as UnsortedSvg } from '../../../assets/svg/unsorted.svg'
import { ReactComponent as SortAscSvg } from '../../../assets/svg/sort_desc.svg'
import { ReactComponent as SortDescSvg } from '../../../assets/svg/sort_asc.svg'
import { ReactComponent as SortNumericDescSvg } from '../../../assets/svg/arrow-up-1-0.svg'
import { ReactComponent as SortNumericAscSvg } from '../../../assets/svg/arrow-down-0-1.svg'
import { ReactComponent as SortStringDescSvg } from '../../../assets/svg/arrow-up-z-a.svg'
import { ReactComponent as SortStringAscSvg } from '../../../assets/svg/arrow-down-a-z.svg'
//import { ReactComponent as ChevronUpSvg } from '../../../assets/svg/chevron-up.svg'
//import { ReactComponent as ChevronDownSvg } from '../../../assets/svg/chevron-down.svg'
import { HeaderItem, TableItem } from './Table'
import { useEffect, useState } from 'react'

export interface SortedColumn {
  name: string
  direction: string
  type: string
  sortQualifier?: ((item: TableItem[]) => number) | undefined
}

interface SortComponentProps {
  selectedSortedColumn: SortedColumn | undefined
  column: HeaderItem
  onSelectSortColumn: (column: SortedColumn) => void
  isLastColumn: boolean
  tableTitle: string
}

const SortComponent = ({
  selectedSortedColumn,
  column,
  onSelectSortColumn,
  isLastColumn,
  tableTitle
}: SortComponentProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false)

  const getSortButton = () => {
    if (column.name !== selectedSortedColumn?.name) {
      return <UnsortedSvg />
    }

    if (selectedSortedColumn?.direction === 'ASC') {
      return getAscSortIcon(column.type)
    } else {
      return getDescSortIcon(column.type)
    }
  }

  const getAscSortIcon = (columnType: string | undefined) => {
    switch (columnType) {
      case 'numeric':
        return <SortNumericAscSvg />
      case 'string':
        return <SortStringAscSvg />
      default:
        return <SortAscSvg />
    }
  }

  const getDescSortIcon = (columnType: string | undefined) => {
    switch (columnType) {
      case 'numeric':
        return <SortNumericDescSvg />
      case 'string':
        return <SortStringDescSvg />
      default:
        return <SortDescSvg />
    }
  }

  const getSortText = (direction: string) => {
    return column.name === selectedSortedColumn?.name && direction === selectedSortedColumn.direction
      ? 'Sorted'
      : 'Sort'
  }

  const handleOutsideNavigationClick = (e: Event) => {
    const targets = e.composedPath() as Element[]
    if (
      !targets.some((target) => {
        return (
          target.id === tableTitle + '-sortBy-' + column.name ||
          target.id === tableTitle + '-menu-sortBy-' + column.name
        )
      })
    ) {
      document.removeEventListener('click', handleOutsideNavigationClick)
      setIsClicked(false)
    }
  }

  useEffect(() => {
    const menu = document.querySelector('[id="' + tableTitle + '-menu-sortBy-' + column.name + '"]')
    if (menu) {
      document.addEventListener('click', handleOutsideNavigationClick)
    }
    return () => {}
  }, [isClicked])

  return (
    <span id={tableTitle + '-sortBy-' + column.name} className={'sort-wrapper'}>
      <a
        onClick={() => {
          setIsClicked(!isClicked)
        }}
        className={'sort-button ' + (isClicked ? 'sort-button-clicked' : '')}
      >
        {getSortButton()}
      </a>
      {isClicked && (
        <ul
          id={tableTitle + '-menu-sortBy-' + column.name}
          className={'menu menu-aligned-' + (isLastColumn ? 'right' : 'left')}
        >
          <li
            onClick={() => {
              setIsClicked(false)
              onSelectSortColumn({
                name: column.name,
                direction: 'ASC',
                type: column.type as string,
                sortQualifier: column.sortQualifier
              })
            }}
          >
            <span className={'li-sort-icon'}>{getAscSortIcon(column.type)}</span>
            <span>{getSortText('ASC')} by Asc</span>
          </li>
          <li
            onClick={() => {
              setIsClicked(false)
              onSelectSortColumn({
                name: column.name,
                direction: 'DESC',
                type: column.type as string,
                sortQualifier: column.sortQualifier
              })
            }}
          >
            <span className={'li-sort-icon'}>{getDescSortIcon(column.type)}</span>
            <span>{getSortText('DESC')} by Desc</span>
          </li>
        </ul>
      )}
    </span>
  )
}

export default SortComponent
