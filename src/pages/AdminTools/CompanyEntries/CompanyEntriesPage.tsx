import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import AuthRequiredPage from '../../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useRef, useState } from 'react'
import { useAcquireToken } from '../../../hooks/auth'
import Table, { HeaderItem, TableItem } from '../../../components/Common/Table/Table'
import { EntryResource } from '../../../types/EntryResource'
import { FdsButtonComponent } from '../../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../../components/fds/FdsInputComponent'
import '../../MyData/_mydata.scss'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from '../../MyData/helpers'
import Pagination from '../../../components/Common/Pagination/Pagination'
import { useParams, useSearchParams } from 'react-router-dom'
import AdminRoleRequiredPage from '../../Error/AdminRoleRequiredPage'
import { EnvironmentContext } from '../../../EnvironmentProvider.tsx'
import VacoBadge from '../../../components/Common/VacoBadge/VacoBadge.tsx'
import { useAdminRightsCheck } from '../hooks'
import { useCompanyEntriesFetch } from './hooks'
import { useSearchInputListener } from '../../../hooks/searchInputListener'
import LoadSpinner from '../../../components/Common/LoadSpinner/LoadSpinner'

const CompanyEntriesPage = () => {
  const [accessToken] = useAcquireToken()
  const bootstrap = useContext(EnvironmentContext)
  const { t } = useTranslation()
  const { businessId } = useParams()
  const [entryData, isFetchInProgress] = useCompanyEntriesFetch(accessToken, businessId)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const [searchWord] = useSearchInputListener(searchInputRef, entryData)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  // Null helps to make a distinction between data not being fetched yet or api actually returning no data (an empty array)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)
  const [searchParams] = useSearchParams()
  const companyName = searchParams?.get('companyName')
  const [hasAdminRole, hasCompanyAdminRole] = useAdminRightsCheck()

  useEffect(() => {
    if (bootstrap && entryData) {
      const entryRows: TableItem[][] = entryData.map((entryResource: EntryResource) => {
        const row: TableItem[] = getTableRow(entryResource, t)
        row.push({
          name: 'status',
          value: <VacoBadge bootstrap={bootstrap} publicId={entryResource.data.publicId} />,
          plainValue: entryResource.data.status.charAt(0).toUpperCase() + entryResource.data.status.slice(1)
        })
        return row
      })
      setAllEntryRows(entryRows)
      setEntriesToShow(entryRows)
    }
  }, [entryData, t, bootstrap])

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
                <div id={'searchInput'} ref={searchInputRef} className={'search-input'}>
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
            <h5 className={'header-wrapper__big'}>{t('services:myData:latest')}</h5>
            {isFetchInProgress && <LoadSpinner />}
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
