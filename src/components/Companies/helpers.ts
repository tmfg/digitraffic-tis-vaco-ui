import { HeaderItem, TableItem } from '../Common/Table/Table'
import { TFunction } from 'i18next'
import { Company } from '../../types/Company'

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

export const getTableRow = (company: Company): TableItem[] => {
  return [
    {
      name: 'name',
      value: company.name,
      href: '/admin/companies/' + company.businessId + '/info',
      plainValue: company.name
    },
    {
      name: 'businessId',
      value: company.businessId,
      plainValue: company.businessId
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
