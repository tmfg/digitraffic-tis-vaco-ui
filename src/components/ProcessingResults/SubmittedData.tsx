import './_section.scss'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import { Entry } from '../../types/EntryResource'
import { formatDate } from '../../util/date'

interface SubmittedDataProps {
  entry: Entry,
  company: string
}

const SubmittedData = ({ entry, company }: SubmittedDataProps) => {
  const { t } = useTranslation()
  const rules = entry.validations.map((item) => (
    <div key={item.name}>{t('services:testData:form:rules:' + item.name)}</div>
  ))
  const conversionRules = entry.conversions?.map((item) => (
    <div key={item.name}>{t('services:testData:form:rules:' + item.name)}</div>
  ))

  const items: KeyValuePairItem[] = [
    {
      label: t('services:testData:form:feedName') as string,
      value: entry.name
    },
    {
      label: t('services:myData:table:id') as string,
      value: entry.publicId
    },
    {
      label: t('services:testData:form:company') as string,
      value: company
    },
    {
      label: t('services:processingResults:submissionDate') as string,
      value: formatDate(entry.created)
    },
    {
      label: t('services:testData:form:url') as string,
      value: entry.url,
      isUrl: true
    },
    {
      label: t('services:testData:form:etag') as string,
      value: entry.etag
    },
    {
      label: t('services:testData:form:format') as string,
      value: t('format:' + entry.format)
    },
    {
      label: t('services:testData:form:section:rules') as string,
      value: <div>{rules && rules.length > 0 ? rules : '-'}</div>
    }
  ]

  if (conversionRules && conversionRules.length > 0) {
    items.push({
      label: t('services:testData:form:section:conversionRules') as string,
      value: <div>{conversionRules}</div>
    })
  }

  return (
    <div className={'section'}>
      <KeyValuePairs items={items} variant={KeyValuePairVariant.big} />
    </div>
  )
}

export default SubmittedData
