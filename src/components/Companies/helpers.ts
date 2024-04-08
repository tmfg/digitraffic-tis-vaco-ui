import { HeaderItem, TableItem } from '../Common/Table/Table'
import { TFunction } from 'i18next'
import { Company } from '../../types/Company'
import { getBusinessId, getCompanyName } from '../../util/company'

export const getTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'name',
      value: t('admin:companies:table:companyName'),
      sortable: true,
      type: 'string'
    },
    {
      name: 'businessId',
      value: t('admin:companies:table:businessId')
    },
    {
      name: 'hierarchy',
      value: t('admin:companies:table:hierarchy')
    },
    {
      name: 'formatSummary',
      value: t('admin:companies:table:formatSummary')
    }
  ]
}

export const getTableRow = (company: Company, t: TFunction<'translation', undefined>): TableItem[] => {
  return [
    {
      name: 'name',
      value: getCompanyName(company.name, t),
      href: '/admin/companies/' + company.businessId + '/info',
      plainValue: getCompanyName(company.name, t)
    },
    {
      name: 'businessId',
      value: getBusinessId(company.businessId),
      plainValue: getBusinessId(company.businessId)
    },
    {
      name: 'formatSummary',
      value: company.formatSummary,
      plainValue: company.formatSummary
    }
  ]
}

export const filterTableRowsBySearchWord = (searchWord: string, allEntryRows: TableItem[][]) => {
  return allEntryRows.filter(
    (row) =>
      (row.filter((column) => column.name === 'businessId')[0].value as string)
        .toLowerCase()
        .includes(searchWord.toLowerCase()) ||
      (row.filter((column) => column.name === 'name')[0].value as string)
        .toLowerCase()
        .includes(searchWord.toLowerCase())
  )
}
