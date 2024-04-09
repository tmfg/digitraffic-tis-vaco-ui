import { TFunction } from 'i18next'
import { HeaderItem, TableItem } from '../Common/Table/Table'
import { formatDate } from '../../util/date'
import { CompanyLatestEntryResource } from '../../types/DataDelivery'
import { getBusinessId, getCompanyName } from '../../util/company'

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
      name: 'context',
      value: t('admin:dataDelivery:table:context'),
      colSpan: 1
    },
    {
      name: 'url',
      value: t('admin:dataDelivery:table:url'),
      colSpan: 3
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
      value: getCompanyName(companyLatestEntryResource.data.companyName, t),
      href:
        '/admin/companies/' +
        companyLatestEntryResource.data.businessId +
        '/data?companyName=' +
        companyLatestEntryResource.data.companyName,
      colSpan: 2,
      plainValue: getCompanyName(companyLatestEntryResource.data.companyName, t)
    },
    {
      name: 'businessId',
      value: getBusinessId(companyLatestEntryResource.data.businessId),
      colSpan: 1,
      plainValue: companyLatestEntryResource.data.businessId
    },
    {
      name: 'context',
      value: companyLatestEntryResource.data.context ? companyLatestEntryResource.data.context : '',
      colSpan: 1,
      plainValue: companyLatestEntryResource.data.context
    },
    {
      name: 'url',
      value: companyLatestEntryResource.data.url !== 'NO_DATA' ? companyLatestEntryResource.data.url : '',
      colSpan: 3,
      plainValue: companyLatestEntryResource.data.url !== 'NO_DATA' ? companyLatestEntryResource.data.url : ''
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
