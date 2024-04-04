import PackageButton from '../PackageButton.tsx'
import { PackageResource } from '../../../types/Package.ts'
import { useTranslation } from 'react-i18next'

interface PackagesProps {
  ruleType: string
  packages: PackageResource[]
}

const Packages = ({ ruleType, packages }: PackagesProps) => {
  const { t } = useTranslation()

  return (
    <div className={'packages-container'}>
      <h5>{t('services:processingResults:packages:header')}</h5>
      <div className={'intro'}>{t('services:processingResults:packages:intro:' + ruleType.toLowerCase())}</div>
      {packages.map((p) => {
        return <PackageButton key={'package-' + p.data.name} entryPackage={p} />
      })}
    </div>
  )
}

export default Packages
