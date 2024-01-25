import './_pagination.scss'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { ReactComponent as PreviousSvg } from '../../../assets/svg/arrow-left-circle.svg'
import { ReactComponent as NextSvg } from '../../../assets/svg/arrow-right-circle.svg'
import { FdsDropdownComponent } from '../../fds/FdsDropdownComponent'
import { FdsDropdownOption } from '../../../../coreui-components/src/fds-dropdown'
import { FdsInputChange } from '../../../../coreui-components/src/fds-input'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  itemsTotalCount: number
  children: ReactNode
  contentName: string
  tableTitle: string
  defaultItemsPerPage: number
}

const Pagination = ({ itemsTotalCount, children, contentName, tableTitle, defaultItemsPerPage }: PaginationProps) => {
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [itemOffset, setItemOffset] = useState<number>(0)
  const [endOffset, setEndOffset] = useState<number>(defaultItemsPerPage)
  const [itemsCount, setItemsCount] = useState<number>(itemsTotalCount)
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage)
  const { t } = useTranslation()

  const getPageCount = () => {
    return Math.ceil(itemsTotalCount / (itemsPerPage || defaultItemsPerPage))
  }
  const [pageCount, setPageCount] = useState(getPageCount())

  const getPageNumbers = () => {
    return [...Array(getPageCount()).keys()].map((i) => i + 1)
  }
  const [pageNumbers, setPageNumbers] = useState(getPageNumbers())

  const itemsPerPageOpts: FdsDropdownOption<string>[] = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' }
  ].filter((opt) => (opt.value as unknown as number) < itemsTotalCount)
  itemsPerPageOpts.push({ label: t('pagination:showAll'), value: itemsTotalCount as unknown as string })

  const handlePageClick = (selectedPage: number) => {
    setSelectedPage(selectedPage)
    const newItemOffset: number = (selectedPage - 1) * itemsPerPage
    setItemOffset(newItemOffset)
    setEndOffset(newItemOffset + itemsPerPage)
  }

  const getPageNumberElements = () => {
    return pageNumbers.map((i) => (
      <span
        onClick={() => handlePageClick(i)}
        className={'page-panel-item ' + (i === selectedPage ? 'page--selected' : '')}
        key={tableTitle + '-page-' + i}
      >
        {i}
      </span>
    ))
  }

  const getPrevious = () => {
    return (
      <span
        onClick={() => {
          if (selectedPage != 1) {
            setSelectedPage(selectedPage - 1)
            const currentOffset = itemOffset
            setItemOffset(currentOffset - itemsPerPage)
            setEndOffset(currentOffset)
          }
        }}
        style={{ marginRight: '2rem' }}
        className={'page-panel-item'}
      >
        <PreviousSvg /> {t('pagination:previous')}
      </span>
    )
  }

  const getNext = () => {
    return (
      <span
        onClick={() => {
          if (selectedPage != pageCount) {
            setSelectedPage(selectedPage + 1)
            const currentOffset = itemOffset
            setItemOffset(currentOffset + itemsPerPage)
            setEndOffset(currentOffset + 2 * itemsPerPage)
          }
        }}
        style={{ marginLeft: '2rem' }}
        className={'page-panel-item'}
      >
        {t('pagination:next')} <NextSvg />
      </span>
    )
  }

  /**
   * When table filter's get applied, that can affect the number of items in the table,
   * hence the need to reset the pagination with newItemsCount;
   * Or if sorting was applied.
   */
  const resetCallback = React.useCallback(
    (newItemsCount: number) => {
      setSelectedPage(1)
      setItemOffset(0)
      setEndOffset(itemsPerPage)
      setItemsCount(newItemsCount)
      const newPageCount = Math.ceil(newItemsCount / itemsPerPage)
      setPageCount(newPageCount)
      setPageNumbers([...Array(newPageCount).keys()].map((i) => i + 1))
    },
    [itemsPerPage]
  )

  const itemsPerPageCallback = React.useCallback(
    (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage)
      setSelectedPage(1)
      setItemOffset(0)
      setEndOffset(newItemsPerPage)
      const newPageCount = Math.ceil(itemsCount / newItemsPerPage)
      setPageCount(newPageCount)
      setPageNumbers([...Array(newPageCount).keys()].map((i) => i + 1))
    },
    [itemsCount]
  )

  const useItemsPerPageSettingListener: EventListenerOrEventListenerObject = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail as FdsInputChange
      if (!detail.value) {
        return
      }
      const newItemsPerPage = parseInt(detail.value as string)
      itemsPerPageCallback(newItemsPerPage)
    },
    [itemsPerPageCallback]
  )

  useEffect(() => {
    const itemsPerPageSettingElement = document.querySelector('[id="itemsPerPageSetting"]')
    if (itemsPerPageSettingElement && itemsPerPageSettingElement.getAttribute('listener') !== 'true') {
      itemsPerPageSettingElement.addEventListener('select', useItemsPerPageSettingListener)
    }

    return () => {
      itemsPerPageSettingElement?.removeEventListener('select', useItemsPerPageSettingListener)
    }
  }, [useItemsPerPageSettingListener])

  return (
    <>
      <div className={'pagination-summary'}>
        <div style={{ marginRight: '10rem' }}>
          {contentName} {itemOffset + 1} - {endOffset < itemsCount ? endOffset : itemsCount} ({t('pagination:total')}{' '}
          {itemsCount})
        </div>
        <div>
          <span style={{ marginRight: '1rem' }}>{t('pagination:perPage')}:</span>
        </div>
        <div>
          <FdsDropdownComponent
            id={'itemsPerPageSetting'}
            value={{ label: itemsPerPage as unknown as string, value: itemsPerPage as unknown as string }}
            name={'itemsPerPageSetting'}
            options={itemsPerPageOpts}
          />
        </div>
      </div>

      {React.Children.map<ReactNode, ReactNode>(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            paginationProps: { itemOffset, endOffset, resetCallback }
          })
        }
      })}

      <div className={'page-panel'}>
        {getPrevious()} {getPageNumberElements()} {getNext()}
      </div>
    </>
  )
}

export default Pagination
