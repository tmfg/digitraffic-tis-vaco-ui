import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import AuthRequiredPage from '../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import { useCallback, useContext, useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import Table, { HeaderItem, TableItem } from '../../components/Common/Table/Table'
import { FdsButtonComponent } from '../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../components/fds/FdsInputComponent'
import '../MyData/_mydata.scss'
import { FdsInputChange } from '../../../coreui-components/src/fds-input'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from '../../components/Companies/helpers'
import Pagination from '../../components/Common/Pagination/Pagination'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../util/role'
import { AppContext, AppContextType } from '../../AppContextProvider'
import AdminRoleRequiredPage from '../Error/AdminRoleRequiredPage'
import { Company } from '../../types/Company'
import CompanyHierarchyModal from '../../components/Companies/CompanyHierarchyModal'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import ViewHierarchyLink from '../../components/Companies/ViewHierarchyLink'

const CompaniesPage = () => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const { t } = useTranslation()
  const [searchWord, setSearchWord] = useState<string | null>(null)
  const [companiesData, setCompaniesData] = useState<Company[] | null>(null)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  // Null helps to make a distinction between data not being fetched yet or api actually returning no data (an empty array)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)
  //const [hierarchyState, setHierarchyState] = useState<Map>({})
  const [isCompleteHierarchyShown, setIsCompleteHierarchyShown] = useState<boolean>(false)

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
      HttpClient.get('/api/ui/admin/companies', getHeaders(accessToken)).then(
        (response) => {
          const companies = response.data.data as Company[]
          setCompaniesData(companies)
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
    // This searchElement used to be in its isolated hook but there were inconsistently reproducing problems with that
    const searchElement = document.querySelector('[id="searchInput"]')
    if (searchElement && searchElement.getAttribute('listener') !== 'true') {
      searchElement.addEventListener('change', useInputListener)
    }

    if (companiesData) {
      const companyRows: TableItem[][] = companiesData.map((company: Company) => {
        const row = getTableRow(company)
        const finalRow = row.slice(0, 2)
        finalRow.push({
          name: 'hierarchy',
          value: <ViewHierarchyLink selectedCompany={company} />,
          plainValue: '',
          colSpan: 1
        })
        finalRow.push(row[row.length - 1])
        return finalRow
      })
      setAllEntryRows(companyRows)
      setEntriesToShow(companyRows)
    }

    return () => {
      searchElement?.removeEventListener('change', useInputListener)
    }
  }, [companiesData, t, useInputListener])

  return (
    <div className={'page-content'}>
      <AuthenticatedTemplate>
        <h1>{t('admin:companies:header')}</h1>
        {hasAdminRole !== undefined && hasCompanyAdminRole !== undefined && !(hasAdminRole || hasCompanyAdminRole) && (
          <AdminRoleRequiredPage />
        )}
        {(hasAdminRole || hasCompanyAdminRole) && (
          <>
            <div style={{ marginTop: '2.5rem' }} className={'searchEntries'}>
              <form>
                <div id={'searchInput'} className={'search-input'}>
                  <FdsInputComponent
                    clearable={true}
                    name={'searchWord'}
                    placeholder={t('admin:companies:searchWordPlaceholder')}
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
            <h5 className={'header-wrapper__big'}></h5>
            {entriesToShow && entriesToShow.length > 0 && (
              <>
                <Pagination
                  contentName={t('pagination:content:companies')}
                  tableTitle={'companiesData'}
                  defaultItemsPerPage={25}
                >
                  <Table
                    tableTitle={'companiesData'}
                    headerItems={headerItems}
                    rows={entriesToShow}
                    isFixedLayout={true}
                    defaultSortedColumn={{ name: 'name', direction: 'ASC', type: 'string' }}
                  />
                </Pagination>
                <FdsButtonComponent
                  onClick={() => setIsCompleteHierarchyShown(true)}
                  icon="scan-search"
                  iconSize={FdsTokenSize2}
                  label={t('admin:companies:viewFullHierarchy')}
                />
                {isCompleteHierarchyShown && (
                  <CompanyHierarchyModal close={() => setIsCompleteHierarchyShown(false)} selectedCompany={null} />
                )}
              </>
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

export default CompaniesPage
