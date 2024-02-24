import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { Company, CompanyHierarchy } from '../../types/Company'
import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import Tree from '../Common/Tree/Tree'
import { FdsTokenSize2, FdsTokenSize21 } from "../../../coreui-css/lib";
import { useTranslation } from 'react-i18next'

interface CompanyHierarchyModalProps {
  close: () => void
  selectedCompany: Company | null
}

const CompanyHierarchyModal = ({ selectedCompany, close }: CompanyHierarchyModalProps) => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [hierarchiesData, setHierarchiesData] = useState<CompanyHierarchy[] | undefined>(undefined)
  const { t } = useTranslation()

  useEffect(() => {
    let ignore = false

    if (inProgress === InteractionStatus.None && isAuthenticated && !ignore && !accessToken) {
      acquireToken(instance, inProgress).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }
          setAccessToken(tokenResult.accessToken)
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [instance, inProgress, accessToken, isAuthenticated])

  useEffect(() => {
    let ignore = false

    if (accessToken && !ignore) {
      HttpClient.get(
        `/api/ui/admin/companies/hierarchy?businessId=${selectedCompany?.businessId ? selectedCompany.businessId : ''}`,
        getHeaders(accessToken)
      ).then(
        (response) => {
          const hierarchies = response.data.data as CompanyHierarchy[]
          setHierarchiesData(hierarchies)
        },
        (error) => {
          // TODO: show alert
          return Promise.reject(error)
        }
      )
    }
    return () => {
      ignore = true
    }
  }, [accessToken, selectedCompany?.businessId])

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
