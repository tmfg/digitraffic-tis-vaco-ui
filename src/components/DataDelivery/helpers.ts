import { TFunction } from 'i18next'
import { HeaderItem, TableItem } from '../Common/Table/Table'
import { formatDate } from '../../util/date'
import { CompanyLatestEntryResource } from '../../types/DataDelivery'

export const getTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'companyName',
      value: t('admin:dataDelivery:table:companyName'),
      colSpan: 2,
      sortable: true,
      type: 'string'
    },
    {
      name: 'businessId',
      value: t('admin:dataDelivery:table:businessId'),
      colSpan: 1
    },
    {
      name: 'format',
      value: t('admin:dataDelivery:table:format'),
      colSpan: 1
    },
    {
      name: 'convertedFormat',
      value: t('admin:dataDelivery:table:convertedFormat'),
      colSpan: 1
    },
    {
      name: 'dateCreated',
      value: t('admin:dataDelivery:table:dateCreated'),
      colSpan: 1
    },
    {
      name: 'status',
      value: t('admin:dataDelivery:table:status'),
      colSpan: 1
    },
    {
      name: 'report',
      value: t('admin:dataDelivery:table:report'),
      colSpan: 1
    }
  ]
}

export const getTableRow = (
  companyLatestEntryResource: CompanyLatestEntryResource,
  t: TFunction<'translation', undefined>
): TableItem[] => {
  return [
    {
      name: 'companyName',
      value: companyLatestEntryResource.data.companyName,
      href: '/admin/companies/' + companyLatestEntryResource.data.businessId +
        '/data?companyName=' + companyLatestEntryResource.data.companyName,
      colSpan: 2,
      plainValue: companyLatestEntryResource.data.companyName
    },
    {
      name: 'businessId',
      value: companyLatestEntryResource.data.businessId,
      colSpan: 1,
      plainValue: companyLatestEntryResource.data.businessId
    },
    {
      name: 'format',
      value: companyLatestEntryResource.data.format || '',
      plainValue: companyLatestEntryResource.data.format || '',
      colSpan: 1
    },
    {
      name: 'convertedFormat',
      value: companyLatestEntryResource.data.convertedFormat || '',
      plainValue: companyLatestEntryResource.data.convertedFormat || '',
      colSpan: 1
    },
    {
      name: 'dateCreated',
      value: formatDate(companyLatestEntryResource.data.created),
      colSpan: 1,
      plainValue: companyLatestEntryResource.data.created || ''
    },
    {
      name: 'report',
      value: companyLatestEntryResource.data.publicId ? t('admin:dataDelivery:table:reportLink') : '',
      href: '/data/' + companyLatestEntryResource.data.publicId,
      colSpan: 1,
      plainValue: companyLatestEntryResource.data.publicId ? t('admin:dataDelivery:table:reportLink') : ''
    }
  ]
}

export const filterTableRowsBySearchWord = (searchWord: string, allRows: TableItem[][]) => {
  return allRows.filter(
    (row) =>
      (row.filter((column) => column.name === 'companyName')[0].value as string)
        .toLowerCase()
        .includes(searchWord.toLowerCase()) ||
      (row.filter((column) => column.name === 'businessId')[0].value as string)
        .toLowerCase()
        .includes(searchWord.toLowerCase())
  )
}
