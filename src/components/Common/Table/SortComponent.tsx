import './_sort.scss'
import './_dropdown-menu.scss'
import UnsortedSvg from '../../../assets/svg/unsorted.svg'
import SortAscSvg from '../../../assets/svg/sort_desc.svg'
import SortDescSvg from '../../../assets/svg/sort_asc.svg'
import SortNumericDescSvg from '../../../assets/svg/arrow-up-1-0.svg'
import SortNumericAscSvg from '../../../assets/svg/arrow-down-0-1.svg'
import SortStringDescSvg from '../../../assets/svg/arrow-up-z-a.svg'
import SortStringAscSvg from '../../../assets/svg/arrow-down-a-z.svg'
import { HeaderItem, TableItem } from './Table'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface SortColumn {
  name: string
  direction: string
  type: string
  sortByCustomOrder?: (item: TableItem[]) => number
}

interface SortComponentProps {
  selectedSortedColumn: SortColumn | undefined
  column: HeaderItem
  sortCallback: (column: SortColumn) => void
  tableTitle: string
}

const SortComponent = ({ selectedSortedColumn, column, sortCallback, tableTitle }: SortComponentProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false)
  const { t } = useTranslation()

  const getSortButton = () => {
    if (column.name !== selectedSortedColumn?.name) {
      return <UnsortedSvg />
    }

    if (selectedSortedColumn?.direction === 'ASC') {
      return <span className="sorted">{getAscSortIcon(column.type)}</span>
    } else {
      return <span className="sorted">{getDescSortIcon(column.type)}</span>
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

  const isSorted = (direction: string) => {
    return column.name === selectedSortedColumn?.name && direction === selectedSortedColumn.direction
  }

  const handleOutsideNavigationClick = useCallback(
    (e: Event) => {
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
    },
    [column, tableTitle]
  )

  useEffect(() => {
    const menu = document.querySelector('[id="' + tableTitle + '-menu-sortBy-' + column.name + '"]')
    if (menu) {
      document.addEventListener('click', handleOutsideNavigationClick)
    }
    return () => {}
  }, [isClicked, column, handleOutsideNavigationClick, tableTitle])

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
        <ul id={tableTitle + '-menu-sortBy-' + column.name} className={'menu'}>
          <li
            onClick={() => {
              setIsClicked(false)
              sortCallback({
                name: column.name,
                direction: 'ASC',
                type: column.type as string,
                sortByCustomOrder: column.sortByCustomOrder
              })
            }}
          >
            <span className={'li-sort-icon'}>{getAscSortIcon(column.type)}</span>
            <span>{isSorted('ASC') ? t('sorting:sorted:asc') : t('sorting:sort:asc')}</span>
          </li>
          <li
            onClick={() => {
              setIsClicked(false)
              sortCallback({
                name: column.name,
                direction: 'DESC',
                type: column.type as string,
                sortByCustomOrder: column.sortByCustomOrder
              })
            }}
          >
            <span className={'li-sort-icon'}>{getDescSortIcon(column.type)}</span>
            <span>{isSorted('DESC') ? t('sorting:sorted:desc') : t('sorting:sort:desc')}</span>
          </li>
        </ul>
      )}
    </span>
  )
}

export default SortComponent
