import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { Company } from '../../types/Company'
import DeleteCompanyModal from './DeleteCompanyModal'

interface DeleteCompanyProps {
  company: Company
}

const DeleteCompany = ({ company }: DeleteCompanyProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isModalShown, setIsModalShown] = useState(false)

  return (
    <>
      <div style={{ marginTop: '2.5rem' }}>
        <FdsButtonComponent
          variant={FdsButtonVariant.danger}
          icon="trash-2"
          onClick={() => setIsModalShown(true)}
          label={t('admin:company:delete:button')}
        />
      </div>
      {isModalShown && (
        <DeleteCompanyModal
          company={company}
          close={() => setIsModalShown(false)}
          onDeleted={() => navigate('/admin/companies')}
        />
      )}
    </>
  )
}

export default DeleteCompany
