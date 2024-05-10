import PackageButton from '../PackageButton.tsx'
import { PackageResource } from '../../../types/Package.ts'
import { useTranslation } from 'react-i18next'

interface PackagesProps {
  taskType: string
  packages: PackageResource[]
}

const Packages = ({ taskType, packages }: PackagesProps) => {
  const { t, i18n } = useTranslation()

  return (
    <div className={'packages-container'}>
      <h5>{t('services:processingResults:packages:header')}</h5>
      {i18n.exists('services:processingResults:packages:intro:' + taskType.toLowerCase()) && (
        <div className={'intro'}>{t('services:processingResults:packages:intro:' + taskType.toLowerCase())}</div>
      )}
      {packages.map((p) => {
        return <PackageButton key={'package-' + p.data.name} entryPackage={p} />
      })}
    </div>
  )
}

export default Packages
