import { TFunction } from 'i18next'
import { HeaderItem } from '../../Common/Table/Table'

export const getNoticesTableHeaders = (t: TFunction<'translation', undefined>): HeaderItem[] => {
  return [
    {
      name: 'code',
      value: t('services:processingResults:notices:code'),
      sortable: true
    },
    {
      name: 'severity',
      value: t('services:processingResults:notices:severity'),
      sortable: true
    },
    {
      name: 'total',
      value: t('services:processingResults:notices:total'),
      sortable: true
    }
  ]
}
