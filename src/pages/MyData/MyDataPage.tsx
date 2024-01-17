import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from "@azure/msal-react";
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import Table, { HeaderItem, TableItem } from '../../components/Common/Table/Table'
import { EntryResource } from '../../types/EntryResource'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../components/fds/FdsInputComponent'
import './_mydata.scss'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from './helpers'
import Pagination from '../../components/Common/Pagination/Pagination'

const MyDataPage = () => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { t } = useTranslation()
  const [searchWord, setSearchWord] = useState<string | null>(null)
  const [entryData, setEntryData] = useState<EntryResource[] | null>(null)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)

  const useInputListener: EventListenerOrEventListenerObject = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as FdsInputChange
    setSearchWord(detail.value as string)
  }, [])

  useEffect(() => {
    const searchElement = document.querySelector('fds-input')
    if (searchElement && searchElement.getAttribute('listener') !== 'true') {
      searchElement.addEventListener('change', useInputListener)
    }

    return () => {
      searchElement?.removeEventListener('change', useInputListener)
    }
  }, [useInputListener])

  useEffect(() => {
    let ignore = false
    if (inProgress === InteractionStatus.None && isAuthenticated && !ignore && !accessToken) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }
          setAccessToken(tokenResult.accessToken)
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [instance, inProgress, accessToken, isAuthenticated])

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore) {
      HttpClient.get('/api/ui/entries?businessId=2942108-7&full=false', getHeaders(accessToken)).then(
        (response) => {
          const entries = response.data as EntryResource[]
          setEntryData(entries)
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken])

  useEffect(() => {
    if (entryData) {
      const entryRows: TableItem[][] = entryData.map((entryResource: EntryResource) => {
        const row: TableItem[] = getTableRow(entryResource, t)
        if (entryResource.links.refs.badge) {
          row.push({
            name: 'status',
            value: <img alt={'badge'} src={entryResource.links.refs.badge.href} />,
            plainValue: entryResource.data.status.charAt(0).toUpperCase() + entryResource.data.status.slice(1)
          })
        }
        return row
      })
      setAllEntryRows(entryRows)
      setEntriesToShow(entryRows)
    }
  }, [entryData, t])

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h1>{t('services:myData:header')}</h1>
        <div className={'page-intro'}>{t('services:myData:intro')}</div>
        <h4 className={'header-wrapper__small'}>{t('services:myData:find')}</h4>
        <div className={'searchEntries'}>
          <form>
            <div className={'search-input'}>
              <FdsInputComponent
                clearable={true}
                name={'searchWord'}
                placeholder={t('services:myData:searchWordPlaceholder')}
                label={t('services:myData:searchWord')}
              />
            </div>
            <div className={'search-button'}>
              <FdsButtonComponent
                onClick={(e) => {
                  e.preventDefault()
                  setEntriesToShow(
                    searchWord && allEntryRows ? filterTableRowsBySearchWord(searchWord, allEntryRows) : allEntryRows
                  )
                }}
                label={t('common:search')}
              />
            </div>
          </form>
        </div>
        {!allEntryRows && ''}
        <h5 className={'header-wrapper__big'}>{t('services:myData:latest')}</h5>
        {entriesToShow && entriesToShow.length > 0 && (
          <Pagination
            itemsTotalCount={entriesToShow.length}
            contentName={t('pagination:content:submissions')}
            tableTitle={'myData'}
            defaultItemsPerPage={25}
          >
            <Table
              tableTitle={'myData'}
              headerItems={headerItems}
              rows={entriesToShow}
              isFixedLayout={true}
              defaultSortedColumn={{ name: 'dateCreated', direction: 'DESC', type: 'date' }}
            />
          </Pagination>
        )}
        {allEntryRows && entriesToShow && entriesToShow.length === 0 && <div>{t('services:myData:noDataFound')}</div>}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default MyDataPage
