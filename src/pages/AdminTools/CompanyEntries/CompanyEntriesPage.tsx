import { useTranslation } from 'react-i18next'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { useOptionalAccessToken } from '../../../hooks/optionalAccessToken'
import { FdsDropdownComponent } from '../../../components/fds/FdsDropdownComponent'
import { FdsDropdownOption } from '../../../../coreui-components/src/fds-dropdown'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../../AppContextProvider'
import { PublicValidationTest } from '../../../types/PublicValidationTest'
import { useCompanyEntriesFetch } from './hooks'
import { getCompanyFullName } from '../../../util/company'
import EntriesSearchTable from './EntriesSearchTable'

const CompanyEntriesView = () => {
  const [accessToken, ready] = useOptionalAccessToken()
  const { t } = useTranslation()
  const { businessId } = useParams()
  const [entryData, isFetchInProgress, notFound] = useCompanyEntriesFetch(accessToken, ready, businessId)
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

  // Null while the company name is not known yet
  let title: string | null = null
  if (notFound) {
    title = t('services:myData:companyNotFound')
  } else if (businessId === PublicValidationTest.businessId && !companies?.length) {
    title = t('vaco:testResults')
  } else if (ownCompany) {
    title = getCompanyFullName(ownCompany.name, ownCompany.businessId, t)
  } else if (entryData) {
    title = getCompanyFullName(entryData.data.companyName, businessId, t)
  }

  // The search form and the table wait for the title, and never show for an unknown company
  const showContent = title !== null && !notFound

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
      <EntriesSearchTable
        entries={entryData?.data?.entries ?? null}
        isFetchInProgress={isFetchInProgress}
        showSearch={showContent}
        hideEntries={notFound}
      />
    </div>
  )
}

// The view is keyed by company, so that switching company never shows the entries of the previous one
const CompanyEntriesPage = () => {
  const { businessId } = useParams()
  return <CompanyEntriesView key={businessId} />
}

export default CompanyEntriesPage
