import { HeaderItem, TableItem } from "../../components/Common/Table/Table";
import { EntryResource } from '../../types/EntryResource'
import { TFunction } from 'i18next'
import { formatDate } from '../../util/date'

export const getTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'publicId',
      value: t('services:myData:table:id'),
      colSpan: 4
    },
    {
      name: 'feedName',
      value: t('services:myData:table:feedName'),
      colSpan: 5,
      sortable: true,
      type: 'string'
    },
    {
      name: 'format',
      value: t('services:myData:table:format'),
      filterable: true,
      colSpan: 2
    },
    {
      name: 'dateCreated',
      value: t('services:myData:table:dateCreated'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'dateStarted',
      value: t('services:myData:table:dateStarted'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'dateUpdated',
      value: t('services:myData:table:dateUpdated'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'dateCompleted',
      value: t('services:myData:table:dateCompleted'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'status',
      value: t('services:myData:table:status'),
      filterable: true,
      customStyle: { width: '110px' }
    }
  ]
}

export const getTableRow = (entryResource: EntryResource, t: TFunction<'translation', undefined>): TableItem[] => {
  return [
    {
      name: 'submissionId',
      value: entryResource.data.publicId,
      href: '/data/' + entryResource.data.publicId,
      colSpan: 4
    },
    {
      name: 'feedName',
      value: entryResource.data.name,
      colSpan: 5,
      plainValue: entryResource.data.name
    },
    {
      name: 'format',
      value: t('format:' + entryResource.data.format.toLowerCase()),
      plainValue: t('format:' + entryResource.data.format.toLowerCase()),
      colSpan: 2
    },
    {
      name: 'dateCreated',
      value: formatDate(entryResource.data.created),
      colSpan: 2,
      plainValue: entryResource.data.created
    },
    {
      name: 'dateStarted',
      value: formatDate(entryResource.data.started),
      colSpan: 2,
      plainValue: entryResource.data.started
    },
    {
      name: 'dateUpdated',
      value: formatDate(entryResource.data.updated),
      colSpan: 2,
      plainValue: entryResource.data.updated
    },
    {
      name: 'dateCompleted',
      value: formatDate(entryResource.data.completed),
      colSpan: 2,
      plainValue: entryResource.data.completed
    }
  ]
}

export const filterTableRowsBySearchWord = (searchWord: string, allEntryRows: TableItem[][]) => {
  return allEntryRows.filter(
    (row) =>
      (row.filter((column) => column.name === 'submissionId')[0].value as string)
        .toLowerCase()
        .includes(searchWord.toLowerCase()) ||
      (row.filter((column) => column.name === 'feedName')[0].value as string)
        .toLowerCase()
        .includes(searchWord.toLowerCase())
  )
}
