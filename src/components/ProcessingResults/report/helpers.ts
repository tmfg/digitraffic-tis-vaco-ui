import { TFunction } from 'i18next'

export const getNoticesTableHeaders = (t: TFunction<'translation', undefined>) => {
  return [
    {
      name: 'code',
      value: t('services:processingResults:notices:code')
    },
    {
      name: 'severity',
      value: t('services:processingResults:notices:severity')
    },
    {
      name: 'total',
      value: t('services:processingResults:notices:total')
    }
  ]
}
