import { TFunction } from 'i18next'
import { getTableItemByColumnName, HeaderItem, TableItem } from '../../Common/Table/Table'

export const getNoticesTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'code',
      value: t('services:processingResults:notices:code'),
      sortable: true,
      type: 'string'
    },
    {
      name: 'severity',
      value: t('services:processingResults:notices:severity'),
      sortable: true,
      type: 'custom',
      sortQualifier: (row: TableItem[]): number => {
        const item: TableItem = getTableItemByColumnName(row, 'severity')
        switch (item.plainValue) {
          case 'ERROR':
            return 4
          case 'WARNING':
            return 3
          case 'INFO':
            return 2
          default:
            return 1
        }
      }
    },
    {
      name: 'total',
      value: t('services:processingResults:notices:total'),
      sortable: true,
      type: 'numeric'
    }
  ]
}
