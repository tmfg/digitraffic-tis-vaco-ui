import { EntrySummary } from '../../../types/EntryResource.ts'
import { TFunction } from 'i18next'
import { HeaderItem, TableItem } from '../../../components/Common/Table/Table.tsx'
import { formatDate } from '../../../util/date.ts'

export const getTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'publicId',
      value: t('services:myData.table.id'),
      colSpan: 4
    },
    {
      name: 'context',
      value: t('services:myData.table.context'),
      colSpan: 2,
      type: 'string',
      filterable: true,
      sortable: true
    },
    {
      name: 'feedName',
      value: t('services:myData.table.feedName'),
      colSpan: 5,
      sortable: true,
      type: 'string'
    },
    {
      name: 'format',
      value: t('services:myData.table.format'),
      filterable: true,
      colSpan: 2
    },
    {
      name: 'dateCreated',
      value: t('services:myData.table.dateCreated'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'dateStarted',
      value: t('services:myData.table.dateStarted'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'dateCompleted',
      value: t('services:myData.table.dateCompleted'),
      colSpan: 2,
      sortable: true,
      type: 'date'
    },
    {
      name: 'status',
      value: t('services:myData.table.status'),
      filterable: true,
      customStyle: { width: '110px' },
      filterDropdownMenuAlignLeft: '-89px'
    }
  ]
}

export const getTableRow = (entryResource: EntrySummary, t: TFunction<'translation', undefined>): TableItem[] => {
  return [
    {
      name: 'submissionId',
      value: entryResource.publicId,
      href: '/data/' + entryResource.publicId,
      colSpan: 4
    },
    {
      name: 'context',
      value: entryResource.context || '',
      plainValue: entryResource.context || '',
      colSpan: 2
    },
    {
      name: 'feedName',
      value: entryResource.name,
      colSpan: 5,
      plainValue: entryResource.name
    },
    {
      name: 'format',
      value: t('format:' + entryResource.format.toLowerCase()),
      plainValue: t('format:' + entryResource.format.toLowerCase()),
      colSpan: 2
    },
    {
      name: 'dateCreated',
      value: formatDate(entryResource.created),
      colSpan: 2,
      plainValue: entryResource.created
    },
    {
      name: 'dateStarted',
      value: formatDate(entryResource.started),
      colSpan: 2,
      plainValue: entryResource.started
    },
    {
      name: 'dateCompleted',
      value: formatDate(entryResource.completed),
      colSpan: 2,
      plainValue: entryResource.completed
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
