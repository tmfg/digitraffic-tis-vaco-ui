import './_section.scss'
import Card, { CardItem, CardVariant } from '../Common/Card/Card'
import { useTranslation } from 'react-i18next'
import { Entry } from '../../types/EntryResource'
import { formatDate } from '../../util/date'

interface SubmittedDataProps {
  entry: Entry
}

const SubmittedData = ({ entry }: SubmittedDataProps) => {
  const { t } = useTranslation()
  const rules = entry.validations.map((item) => (
    <div key={item.name}>{t('services:testData:form:rules:' + item.name)}</div>
  ))

  const items: CardItem[] = [
    {
      label: t('services:testData:form:feedName'),
      value: entry.name
    },
    {
      label: 'ID',
      value: entry.publicId
    },
    {
      label: t('services:processingResults:submissionDate'),
      value: formatDate(entry.created)
    },
    {
      label: t('services:testData:form:url'),
      value: entry.url
    },
    {
      label: t('services:testData:form:etag'),
      value: entry.etag
    },
    {
      label: t('services:testData:form:format'),
      value: t('format:' + entry.format)
    },
    {
      label: t('services:testData:form:section:rules'),
      value: <div>{rules}</div>
    }
  ]

  return (
    <div className={'section'}>
      <Card items={items} variant={CardVariant.big} />
    </div>
  )
}

export default SubmittedData
