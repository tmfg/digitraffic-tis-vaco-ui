import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import AddCompanyModal from './AddCompanyModal'

const AddCompany = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isModalShown, setIsModalShown] = useState(false)

  return (
    <>
      <FdsButtonComponent
        onClick={() => setIsModalShown(true)}
        icon="plus"
        iconSize={FdsTokenSize2}
        label={t('admin:companies:add:button')}
      />
      {isModalShown && (
        <AddCompanyModal
          close={() => setIsModalShown(false)}
          onCreated={(company) => navigate('/admin/companies/' + company.businessId + '/info')}
        />
      )}
    </>
  )
}

export default AddCompany
