import './_pagination.scss'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import PreviousSvg from '../../../assets/svg/arrow-left-circle.svg'
import NextSvg from '../../../assets/svg/arrow-right-circle.svg'
import { FdsDropdownComponent } from '../../fds/FdsDropdownComponent'
import { FdsDropdownOption } from '../../../../coreui-components/src/fds-dropdown'
import { FdsInputChange } from '../../../../coreui-components/src/fds-input'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  children: ReactNode
  contentName: string
  tableTitle: string
  defaultItemsPerPage: number
}

/**
 * Pagination is unaware of the actual data it's paginating.
 * It gets from the children's callback how many items there are actually, and then produces the relevant paging
 * @param children
 * @param contentName
 * @param tableTitle
 * @param defaultItemsPerPage
 * @constructor
 */
const Pagination = ({ children, contentName, tableTitle, defaultItemsPerPage }: PaginationProps) => {
  const [selectedPage, setSelectedPage] = useState<number>(1)
  const [itemOffset, setItemOffset] = useState<number>(0)
  const [endOffset, setEndOffset] = useState<number>(defaultItemsPerPage)
  const [itemsCount, setItemsCount] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage)
  const [pageCount, setPageCount] = useState<number>(0)
  const [pageNumbers, setPageNumbers] = useState<number[]>([])
  const [itemsPerPageOpts, setItemsPerPageOpts] = useState<FdsDropdownOption<string>[]>([])
  const { t } = useTranslation()

  /**
   * Re-rendering page numbers if rows have changed due to external factors
   * (e.g. search input, itemsPerPage change, filter's selection in child component)
   */
  useEffect(() => {
    if (!itemsCount) {
      setPageCount(0)
      setPageNumbers([])
      return
    }
    const newPageCount = Math.ceil(itemsCount / itemsPerPage)
    setPageCount(newPageCount)
    const newPageNumbers = [...Array(newPageCount + 1).keys()].slice(1)
    setPageNumbers(newPageNumbers)

    const newItemsPerPageOpts: FdsDropdownOption<string>[] = [
      { label: '5', value: '5' },
      { label: '10', value: '10' },
      { label: '25', value: '25' },
      { label: '50', value: '50' }
    ].filter((opt) => (opt.value as unknown as number) < itemsCount)
    newItemsPerPageOpts.push({ label: t('pagination:showAll'), value: itemsCount as unknown as string })
    setItemsPerPageOpts(newItemsPerPageOpts)
  }, [itemsPerPage, itemsCount, t])

  /**
   * When table filter's get applied, that can affect the number of items in the table,
   * hence the need to reset the pagination with newItemsCount;
   * Or if sorting was applied.
   * Or if some external event changes content (e.g. search word)
   */
  const resetCallback = React.useCallback(
    (newItemsCount: number) => {
      if (newItemsCount === undefined) {
        // this doesn't happen anymore, but just in case...
        return
      }

      setSelectedPage(1)
      setItemOffset(0)
      setEndOffset(itemsPerPage)
      setItemsCount(newItemsCount)
    },
    [itemsPerPage]
  )

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

  const itemsPerPageCallback = React.useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setSelectedPage(1)
    setItemOffset(0)
    setEndOffset(newItemsPerPage)
  }, [])

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

  const renderChildContent = () => {
    return React.Children.map<ReactNode, ReactNode>(children, (child) => {
      if (React.isValidElement<{ paginationProps?: any; resetCallback?: any }>(child)) {
        return React.cloneElement(child, {
          ...child.props,
          paginationProps: { itemOffset, endOffset },
          resetCallback
        })
      }
    })
  }

  return (
    <>
      <div className={'pagination-summary'}>
        <div style={{ marginRight: '9.2rem' }}>
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

      {renderChildContent()}

      {pageNumbers.length > 0 && (
        <div className={'page-panel'}>
          {getPrevious()} {getPageNumberElements()} {getNext()}
        </div>
      )}
    </>
  )
}

// Preventing (or trying to...) the whole thing from re-rendering if the parent's state changes,
// and it doesn't affect Pagination's props
export default React.memo(Pagination)
