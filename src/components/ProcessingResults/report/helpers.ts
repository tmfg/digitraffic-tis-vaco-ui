import { TFunction } from 'i18next'
import { getTableItemByColumnName, HeaderItem, TableItem } from '../../Common/Table/Table'

export const getNoticesTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'code',
      value: t('services:processingResults:notices:code'),
      sortable: true,
      type: 'string',
      colSpan: 3
    },
    {
      name: 'severity',
      value: t('services:processingResults:notices:severity'),
      sortable: true,
      filterable: true,
      type: 'custom',
      sortByCustomOrder: (row: TableItem[]): number => {
        const item: TableItem = getTableItemByColumnName(row, 'severity')
        switch (item.plainValue) {
          case t('services:processingResults:severity:error'):
            return 4
          case t('services:processingResults:severity:warning'):
            return 3
          case t('services:processingResults:severity:info'):
            return 2
          default:
            return 1
        }
      },
      colSpan: 2
    },
    {
      name: 'total',
      value: t('services:processingResults:notices:total'),
      sortable: true,
      type: 'numeric'
    }
  ]
}
