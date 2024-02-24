import { ReactComponent as NetworkSvg } from '../../assets/svg/network.svg'
import CompanyHierarchyModal from './CompanyHierarchyModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Company } from '../../types/Company'

interface ViewHierarchyLinkProps {
  selectedCompany: Company
}

const ViewHierarchyLink = ({ selectedCompany }: ViewHierarchyLinkProps) => {
  const { t } = useTranslation()
  const [isHierarchyShown, setIsHierarchyShown] = useState<boolean>(false)

  return (
    <>
      <NetworkSvg />{' '}
      <span
        onClick={() => {
          setIsHierarchyShown(true)
        }}
        className={'link'}
      >
        {t('admin:companies:table:viewHierarchy')}
      </span>
      {isHierarchyShown && (
        <CompanyHierarchyModal
          selectedCompany={selectedCompany}
          close={() => {
            setIsHierarchyShown(false)
          }}
        />
      )}
    </>
  )
}

export default ViewHierarchyLink
