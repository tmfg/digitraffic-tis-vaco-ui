import { HeaderItem, TableItem } from '../Common/Table/Table'
import { TFunction } from 'i18next'
import { Company } from '../../types/Company'

export const getTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'name',
      value: t('admin:companies:table:companyName'),
      colSpan: 1,
      sortable: true,
      type: 'string'
    },
    {
      name: 'businessId',
      value: t('admin:companies:table:businessId'),
      colSpan: 1
    },
    {
      name: 'hierarchy',
      value: t('admin:companies:table:hierarchy'),
      colSpan: 1
    },
    {
      name: 'formatSummary',
      value: t('admin:companies:table:formatSummary'),
      colSpan: 1
    }
  ]
}

export const getTableRow = (company: Company): TableItem[] => {
  return [
    {
      name: 'name',
      value: company.name,
      href: '/admin/companies/' + company.businessId + '/info',
      colSpan: 1,
      plainValue: company.name
    },
    {
      name: 'businessId',
      value: company.businessId,
      colSpan: 1,
      plainValue: company.businessId
    },
    {
      name: 'formatSummary',
      value: company.formatSummary,
      plainValue: company.formatSummary,
      colSpan: 1
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
