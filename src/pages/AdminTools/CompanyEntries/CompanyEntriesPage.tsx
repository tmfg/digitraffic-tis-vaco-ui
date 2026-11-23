import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useOptionalAccessToken } from '../../../hooks/optionalAccessToken'
import Table, { HeaderItem, TableItem } from '../../../components/Common/Table/Table'
import { FdsButtonComponent } from '../../../components/fds/FdsButtonComponent'
import { FdsDropdownComponent } from '../../../components/fds/FdsDropdownComponent'
import { FdsInputComponent } from '../../../components/fds/FdsInputComponent'
import { FdsDropdownOption } from '../../../../coreui-components/src/fds-dropdown'
import '../_mydata.scss'
import '../../../components/Common/SearchPanel/_search-panel.scss'
import Pagination from '../../../components/Common/Pagination/Pagination'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppContext } from '../../../AppContextProvider'
import { PublicValidationTest } from '../../../types/PublicValidationTest'
import { EnvironmentContext } from '../../../EnvironmentProvider.tsx'
import VacoBadge from '../../../components/Common/VacoBadge/VacoBadge.tsx'
import { useCompanyEntriesFetch } from './hooks'
import { useSearchInputListener } from '../../../hooks/searchInputListener'
import LoadSpinner from '../../../components/Common/LoadSpinner/LoadSpinner'
import { getCompanyFullName } from '../../../util/company'
import { EntrySummary } from '../../../types/EntryResource.ts'
import { filterTableRowsBySearchWord, getTableHeaders, getTableRow } from './helpers.ts'

const CompanyEntriesView = () => {
  const [accessToken, ready] = useOptionalAccessToken()
  const bootstrap = useContext(EnvironmentContext)
  const { t } = useTranslation()
  const { businessId } = useParams()
  const [entryData, isFetchInProgress] = useCompanyEntriesFetch(accessToken, ready, businessId)
  const searchInputRef = useRef<HTMLDivElement | null>(null)
  const [searchWord] = useSearchInputListener(searchInputRef, entryData)
  const [allEntryRows, setAllEntryRows] = useState<TableItem[][] | null>(null)
  // Null helps to make a distinction between data not being fetched yet or api actually returning no data (an empty array)
  const [entriesToShow, setEntriesToShow] = useState<TableItem[][] | null>(null)
  const headerItems: HeaderItem[] = getTableHeaders(t)
  const [searchParams] = useSearchParams()
  const companyName = searchParams.get('companyName')
  const navigate = useNavigate()
  const { companies } = useContext(AppContext)
  const ownCompany = companies?.find((company) => company.businessId === businessId)
  const companyOptions: FdsDropdownOption<string>[] = useMemo(
    () =>
      (companies ?? []).map((company) => ({
        label: getCompanyFullName(company.name, company.businessId, t),
        value: company.businessId
      })),
    [companies, t]
  )
  const showCompanyDropdown = ownCompany !== undefined && companyOptions.length >= 2
  const companyDropdownRef = useRef<HTMLDivElement | null>(null)

  let title: string
  if (businessId === PublicValidationTest.businessId && !companies?.length) {
    title = t('vaco:testResults')
  } else if (ownCompany) {
    title = getCompanyFullName(ownCompany.name, ownCompany.businessId, t)
  } else {
    title = getCompanyFullName(companyName, businessId, t)
  }

  useEffect(() => {
    const element = companyDropdownRef.current
    if (!showCompanyDropdown || !element) {
      return
    }
    const onSelect = (e: Event) => {
      const selected = (e as CustomEvent<{ value?: string }>).detail?.value
      if (selected && selected !== businessId) {
        void navigate('/data/companies/' + selected)
      }
    }
    element.addEventListener('select', onSelect)
    return () => element.removeEventListener('select', onSelect)
  }, [showCompanyDropdown, businessId, navigate])

  useEffect(() => {
    if (bootstrap && entryData && entryData.data) {
      const entryRows: TableItem[][] = entryData.data.entries.map((entrySummary: EntrySummary) => {
        const row: TableItem[] = getTableRow(entrySummary, t)
        row.push({
          name: 'status',
          value: <VacoBadge bootstrap={bootstrap} publicId={entrySummary.publicId} />,
          plainValue: entrySummary.status.charAt(0).toUpperCase() + entrySummary.status.slice(1)
        })
        return row
      })
      setAllEntryRows(entryRows)
      setEntriesToShow(entryRows)
    }
  }, [entryData, t, bootstrap])

  return (
    <div className={'page-content'}>
      <h1>{title}</h1>
      {showCompanyDropdown && (
        <div ref={companyDropdownRef} className={'input-wrapper'}>
          <FdsDropdownComponent
            name={'businessId'}
            label={t('services:testData.form.company')}
            options={companyOptions}
            value={companyOptions.find((option) => option.value === businessId)}
          />
        </div>
      )}
      <h4 style={{ marginTop: '2.5rem' }} className={'header-wrapper__small'}>
        {t('services:myData:find')}
      </h4>
      <div className={'search-panel'}>
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
                  searchWord && allEntryRows ? filterTableRowsBySearchWord(searchWord, allEntryRows) : allEntryRows
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
        <Pagination contentName={t('pagination:content:submissions')} tableTitle={'myData'} defaultItemsPerPage={25}>
          <Table
            tableTitle={'myData'}
            headerItems={headerItems}
            rows={entriesToShow}
            isFixedLayout={true}
            defaultSortedColumn={{ name: 'dateCreated', direction: 'DESC', type: 'date' }}
          />
        </Pagination>
      )}
      {allEntryRows && entriesToShow?.length === 0 && <div>{t('services:myData:noDataFound')}</div>}
    </div>
  )
}

// The view is keyed by company, so that switching company never shows the entries of the previous one
const CompanyEntriesPage = () => {
  const { businessId } = useParams()
  return <CompanyEntriesView key={businessId} />
}

export default CompanyEntriesPage
