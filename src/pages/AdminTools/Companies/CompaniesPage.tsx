import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import AuthRequiredPage from '../../Error/AuthRequiredPage'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { useAcquireToken } from '../../../hooks/auth'
import Table, { HeaderItem, TableItem } from '../../../components/Common/Table/Table'
import { FdsButtonComponent } from '../../../components/fds/FdsButtonComponent'
import { FdsInputComponent } from '../../../components/fds/FdsInputComponent'
import '../../MyData/_mydata.scss'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from '../../../components/Companies/helpers'
import Pagination from '../../../components/Common/Pagination/Pagination'
import AdminRoleRequiredPage from '../../Error/AdminRoleRequiredPage'
import { Company } from '../../../types/Company'
import CompanyHierarchyModal from '../../../components/Companies/CompanyHierarchyModal'
import { FdsTokenSize2 } from '../../../../coreui-css/lib'
import ViewHierarchyLink from '../../../components/Companies/ViewHierarchyLink'
import { useAdminRightsCheck } from '../hooks'
import { useCompaniesFetch } from './hooks'
import LoadSpinner from '../../../components/Common/LoadSpinner/LoadSpinner'
import { useSearchInputListener } from '../../../hooks/searchInputListener'

const CompaniesPage = () => {
  const [accessToken] = useAcquireToken()
  const { t } = useTranslation()
  const [companiesData, isFetchInProgress] = useCompaniesFetch(accessToken)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const [searchWord] = useSearchInputListener(searchInputRef, companiesData)
  const [allCompanyRows, setAllCompanyRows] = useState<TableItem[][] | null>(null)
  // Null helps to make a distinction between data not being fetched yet or api actually returning no data (an empty array)
  const [companiesToShow, setCompaniesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)
  const [isCompleteHierarchyShown, setIsCompleteHierarchyShown] = useState<boolean>(false)
  const [hasAdminRole, hasCompanyAdminRole] = useAdminRightsCheck()

  useEffect(() => {
    if (companiesData) {
      const companyRows: TableItem[][] = companiesData.map((company: Company) => {
        const row = getTableRow(company, t)
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
      setAllCompanyRows(companyRows)
      setCompaniesToShow(companyRows)
    }

    return () => {}
  }, [companiesData, t])

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
                <div id={'searchInput'} ref={searchInputRef} className={'search-input'}>
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
                      setCompaniesToShow(
                        searchWord && allCompanyRows
                          ? filterTableRowsBySearchWord(searchWord, allCompanyRows)
                          : allCompanyRows
                      )
                    }}
                    label={t('common:search')}
                  />
                </div>
              </form>
            </div>
            <h5 className={'header-wrapper__big'}></h5>
            {isFetchInProgress && <LoadSpinner />}
            {companiesToShow && companiesToShow.length > 0 && (
              <>
                <Pagination
                  contentName={t('pagination:content:companies')}
                  tableTitle={'companiesData'}
                  defaultItemsPerPage={25}
                >
                  <Table
                    tableTitle={'companiesData'}
                    headerItems={headerItems}
                    rows={companiesToShow}
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
            {allCompanyRows && companiesToShow && companiesToShow.length === 0 && (
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
