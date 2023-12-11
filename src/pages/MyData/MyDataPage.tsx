import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import Table, { TableItem } from '../../components/Common/Table/Table'
import { EntryResource } from '../../types/EntryResource'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../components/fds/FdsInputComponent'
import './_mydata.scss'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from './helpers'

const MyDataPage = () => {
  const { instance, inProgress } = useMsal()
  const { t } = useTranslation()
  const [searchWord, setSearchWord] = useState<string | null>(null)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems = getTableHeaders(t)

  const useInputListener: EventListenerOrEventListenerObject = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as FdsInputChange
    setSearchWord(detail.value as string)
  }, [])

  useEffect(() => {
    let ignore = false
    setAllEntryRows(null)
    const searchElement = document.querySelector('fds-input')
    if (searchElement && searchElement.getAttribute('listener') !== 'true') {
      searchElement.addEventListener('change', useInputListener)
    }

    if (inProgress === InteractionStatus.None && !ignore) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }

          HttpClient.get('/api/ui/entries?businessId=2942108-7&full=false', getHeaders(tokenResult.accessToken)).then(
            (response) => {
              if (!ignore) {
                const entries = response.data as EntryResource[]
                const entryRows: TableItem[][] = entries.map((entryResource: EntryResource) => {
                  return getTableRow(entryResource, t)
                })
                setAllEntryRows(entryRows)
                setEntriesToShow(entryRows)
              }
            },
            (error) => {
              // TODO: show alert
              return Promise.reject(error)
            }
          )
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }

    return () => {
      ignore = true
      searchElement?.removeEventListener('change', useInputListener)
    }
  }, [instance, inProgress, useInputListener])

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h2>{t('services:myData:header')}</h2>
        <div className={'page-intro'}>
          {t('services:myData:intro')}
        </div>
        <h4 className={'header-wrapper__small'}>{t('services:myData:find')}</h4>
        <div className={'searchEntries'}>
          <form>
            <div className={'search-input'}>
              <FdsInputComponent
                clearable={true}
                name={'searchWord'}
                placeholder={t('services:myData:table:id') + ' or ' + (t('services:myData:table:feedName') as string).toLowerCase()}
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
          <Table tableTitle={'myData'} headerItems={headerItems} rows={entriesToShow} />
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
