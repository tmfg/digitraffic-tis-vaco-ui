import { useAcquireToken } from '../../hooks/auth'
import { Company } from '../../types/Company'
import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import Tree from '../Common/Tree/Tree'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { useTranslation } from 'react-i18next'
import { useCompaniesHierarchyFetch } from './hooks'
import LoadSpinner from '../Common/LoadSpinner/LoadSpinner'

interface CompanyHierarchyModalProps {
  close: () => void
  selectedCompany: Company | null
}

const CompanyHierarchyModal = ({ selectedCompany, close }: CompanyHierarchyModalProps) => {
  const [accessToken] = useAcquireToken()
  const [hierarchiesData, setHierarchiesData, isFetchInProgress] = useCompaniesHierarchyFetch(
    accessToken,
    selectedCompany
  )
  const { t } = useTranslation()

  return (
    <div>
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">
            {selectedCompany
              ? selectedCompany.name + ' (' + selectedCompany.businessId + ')'
              : t('admin:companies:completeHierarchy')}
          </h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          {isFetchInProgress && <LoadSpinner />}

          <div className={'company-hierarchy'}>
            {hierarchiesData?.map((tree, i) => (
              <Tree
                updateHierarchyCallback={setHierarchiesData}
                truncated={!!selectedCompany}
                pageCompany={selectedCompany}
                hierarchy={tree}
                key={'tree-' + i}
                viewOnly={true}
              />
            ))}
          </div>

          <FdsActionSheetComponent style={{ marginTop: '2rem' }}>
            <FdsButtonComponent
              onClick={close}
              slot="separated"
              icon="x"
              iconSize={FdsTokenSize2}
              variant={FdsButtonVariant.secondary}
              label={t('common:close')}
            />
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default CompanyHierarchyModal
