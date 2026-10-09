import { useTranslation } from 'react-i18next'

interface LinkedDataListProps {
  references: Record<string, number>
}

const LinkedDataList = ({ references }: LinkedDataListProps) => {
  const { t } = useTranslation()
  return (
    <ul>
      {Object.entries(references).map(([kind, count]) => (
        <li key={kind}>
          {t(`admin:company:delete:linkedKinds:${kind}`, { defaultValue: kind })}: {count}
        </li>
      ))}
    </ul>
  )
}

export default LinkedDataList
