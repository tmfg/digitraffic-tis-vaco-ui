import '../Common/Section/_section.scss'
import KeyValuePairs, { KeyValuePairItem, KeyValuePairVariant } from '../Common/KeyValuePairs/KeyValuePairs'
import { useTranslation } from 'react-i18next'
import { Entry } from '../../types/EntryResource'
import { formatDate } from '../../util/date'
import { PublicValidationTest } from '../../types/PublicValidationTest'
import ExpiryWarning from './ExpiryWarning'

interface SubmittedDataProps {
  entry: Entry
  company: string
}

const SubmittedData = ({ entry, company }: SubmittedDataProps) => {
  const { t } = useTranslation()
  const rules = entry.validations?.map((item) => (
    <div key={item.name}>{t('services:testData:form:rules:' + item.name)}</div>
  ))
  const conversionRules = entry.conversions?.map((item) => (
    <div key={item.name}>{t('services:testData:form:rules:' + item.name)}</div>
  ))

  const items: KeyValuePairItem[] = [
    {
      label: t('services:testData:form:feedName'),
      value: entry.name
    },
    {
      label: t('services:myData:table:id'),
      value: entry.publicId
    },
    {
      label: t('services:testData:form:company'),
      value: company.includes(PublicValidationTest.businessId) ? t('publicValidationTest:companyName') : company
    },
    {
      label: t('services:processingResults:submissionDate'),
      value: formatDate(entry.created)
    },
    {
      label: t('services:testData:form:context'),
      value: entry.context
    },
    {
      label: t('services:testData:form:url'),
      value: entry.url,
      isUrl: true
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
      label: t('services:testData:form:section:validationRules'),
      value: <div>{rules && rules.length > 0 ? rules : '-'}</div>
    }
  ]

  if (conversionRules && conversionRules.length > 0) {
    items.push({
      label: t('services:testData:form:section:conversionRules'),
      value: <div>{conversionRules}</div>
    })
  }

  return (
    <section>
      <ExpiryWarning entry={entry} />
      <KeyValuePairs items={items} variant={KeyValuePairVariant.big} />
    </section>
  )
}

export default SubmittedData
