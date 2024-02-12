import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import { useCallback, useContext, useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import Table, { HeaderItem, TableItem } from '../../components/Common/Table/Table'
import { EntryResource } from '../../types/EntryResource'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../components/fds/FdsInputComponent'
import '../MyData/_mydata.scss'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from '../MyData/helpers'
import Pagination from '../../components/Common/Pagination/Pagination'
import { useParams, useSearchParams } from 'react-router-dom'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import { AppContext, AppContextType } from '../../AppContextProvider'
import AdminRoleRequiredPage from '../Error/AdminRoleRequiredPage'

const CompanyEntriesPage = () => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { t } = useTranslation()
  const [searchWord, setSearchWord] = useState<string | null>(null)
  const [entryData, setEntryData] = useState<EntryResource[] | null>(null)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  // Null helps to make a distinction between data not being fetched yet or api actually returning no data (an empty array)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)
  const { businessId } = useParams()
  const [searchParams] = useSearchParams()
  const companyName = searchParams?.get('companyName')
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)

  const useInputListener: EventListenerOrEventListenerObject = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail as FdsInputChange
    setSearchWord(detail.value as string)
  }, [])

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
  }, [appContext])

  useEffect(() => {
    let ignore = false

    // This searchElement used to be in its isolated hook but there were inconsistently reproducing problems with that
    const searchElement = document.querySelector('[id="searchInput"]')
    if (searchElement && searchElement.getAttribute('listener') !== 'true') {
      searchElement.addEventListener('change', useInputListener)
    }

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
      searchElement?.removeEventListener('change', useInputListener)
    }
  }, [instance, inProgress, accessToken, isAuthenticated, useInputListener])

  useEffect(() => {
    let ignore = false
    if (accessToken && !ignore && businessId) {
      HttpClient.get('/api/ui/admin/entries?businessId=' + businessId, getHeaders(accessToken)).then(
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
  }, [accessToken, businessId])

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
        <h1>
          {companyName} ({businessId})
        </h1>
        {hasAdminRole !== undefined && hasCompanyAdminRole !== undefined && !(hasAdminRole || hasCompanyAdminRole) && (
          <AdminRoleRequiredPage />
        )}
        {(hasAdminRole || hasCompanyAdminRole) && (
          <>
            <h4 style={{ marginTop: '2.5rem' }} className={'header-wrapper__small'}>
              {t('services:myData:find')}
            </h4>
            <div className={'searchEntries'}>
              <form>
                <div id={'searchInput'} className={'search-input'}>
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
                        searchWord && allEntryRows
                          ? filterTableRowsBySearchWord(searchWord, allEntryRows)
                          : allEntryRows
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
            {allEntryRows && entriesToShow && entriesToShow.length === 0 && (
              <div>{t('services:myData:noDataFound')}</div>
            )}
          </>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default CompanyEntriesPage
