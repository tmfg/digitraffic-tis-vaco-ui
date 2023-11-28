import { TableItem } from '../../components/Common/Table/Table'
import { EntryResource } from '../../types/EntryResource'
import { TFunction } from 'i18next'
import { formatDate } from '../../util/date'

export const getTableHeaders = (t: TFunction<'translation', undefined>) => {
  return [
    {
      name: 'publicId',
      value: t('services:myData:table:id')
    },
    {
      name: 'feedName',
      value: t('services:myData:table:feedName')
    },
    {
      name: 'format',
      value: t('services:myData:table:format')
    },
    {
      name: 'dateCreated',
      value: t('services:myData:table:dateCreated')
    },
    {
      name: 'dateStarted',
      value: t('services:myData:table:dateStarted')
    },
    {
      name: 'dateUpdated',
      value: t('services:myData:table:dateUpdated')
    },
    {
      name: 'dateCompleted',
      value: t('services:myData:table:dateCompleted')
    },
    {
      name: 'status',
      value: t('services:myData:table:status')
    }
  ]
}

export const getTableRow = (entryResource: EntryResource, t: TFunction<'translation', undefined>): TableItem[] => {
  let status = 'Received'
  if (entryResource.data.completed) {
    status = 'Completed'
  } else if (entryResource.data.started) {
    status = 'In progress'
  }
  return [
    {
      name: 'submissionId',
      value: entryResource.data.publicId,
      href: '/data/' + entryResource.data.publicId
    },
    {
      name: 'feedName',
      value: entryResource.data.name
    },
    {
      name: 'format',
      value: t('format:' + entryResource.data.format.toLowerCase())
    },
    {
      name: 'dateCreated',
      value: formatDate(entryResource.data.created)
    },
    {
      name: 'dateStarted',
      value: formatDate(entryResource.data.started)
    },
    {
      name: 'dateUpdated',
      value: formatDate(entryResource.data.updated)
    },
    {
      name: 'dateCompleted',
      value: formatDate(entryResource.data.completed)
    },
    {
      name: 'status',
      value: status
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
