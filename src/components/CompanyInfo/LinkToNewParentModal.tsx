import { useTranslation } from 'react-i18next'
import { FdsDialogComponent } from '../fds/FdsDialogComponent'
import { FdsCardComponent } from '../fds/FdsCardComponent'
import { FdsCardElevation } from '../../../coreui-components/src/fds-card'
import { FdsActionSheetComponent } from '../fds/FdsActionSheetComponent'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'
import { FdsTokenSize2, FdsTokenSize21 } from '../../../coreui-css/lib'
import { Company, CompanyHierarchy } from '../../types/Company'
import { useState } from 'react'
import { FdsIconComponent } from '../fds/FdsIconComponent'
import { acquireToken } from '../../hooks/auth'
import { useMsal } from '@azure/msal-react'
import { getHeaders, HttpClient } from '../../HttpClient'
import Tree from '../Common/Tree/Tree'
import LoadSpinner from '../Common/LoadSpinner/LoadSpinner'
import { getCompanyFullName, getCompanyName } from "../../util/company";

interface ModalProps {
  close: () => void
  proceed: (parentBusinessId: string | null) => void
  companyB: Company
}

const LinkToNewParentModal = ({ close, proceed, companyB }: ModalProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [hierarchyData, setHierarchyData] = useState<CompanyHierarchy[] | null>(null)
  const [isFetchInProgress, setIsFetchInProgress] = useState<boolean>(false)
  const [hierarchyDataOpen, setHierarchyDataOpen] = useState<boolean>(false)
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const linkExists = (hierarchies: CompanyHierarchy[], newSelectedBusinessId: string) => {
    if (!hierarchies) {
      return false
    }
    for (let i = 0; i < hierarchies.length; i++) {
      if (hierarchies[i].company.businessId === newSelectedBusinessId) {
        const res = inspectChildrenOfFoundCompany(hierarchies[i], companyB.businessId)
        if (res) {
          return true
        }
      }

      if (hierarchies[i].company.businessId === companyB.businessId) {
        const res = inspectChildrenOfFoundCompany(hierarchies[i], newSelectedBusinessId)
        if (res) {
          return true
        }
      }

      const res = linkExists(hierarchies[i].children, newSelectedBusinessId)
      if (res) {
        return true
      }
    }
  }

  const inspectChildrenOfFoundCompany = (hierarchy: CompanyHierarchy, businessIdToCheck: string) => {
    for (let j = 0; j < hierarchy.children.length; j++) {
      if (hierarchy.children[j].company.businessId === businessIdToCheck) {
        // Duplicate link found
        return true
      }
    }
  }

  return (
    <div>
      <FdsDialogComponent modal={true}>
        <FdsCardComponent elevation={FdsCardElevation.none}>
          <h4 slot="header-title">{t('admin:partnership:link')}</h4>
          <FdsButtonComponent
            onClick={close}
            variant={FdsButtonVariant.tertiary}
            icon={'x'}
            iconSize={FdsTokenSize21}
            slot="header-corner"
          />

          <div style={{ marginBottom: '1rem' }}>
            {t('admin:partnership:linkInstruction', {
              name: getCompanyName(companyB.name, t)
            })}
          </div>

          {selectedBusinessId && (
            <div>
              {t('admin:partnership:selectedParent')}:
              <span style={{ fontWeight: 700, marginLeft: '8px' }}>
                {getCompanyFullName(selectedCompanyName, selectedBusinessId, t)}
              </span>
            </div>
          )}

          {error && <div style={{ marginBottom: '1rem', color: '#e55636' }}>{error}</div>}

          <div
            onClick={() => {
              if (!hierarchyData && !hierarchyDataOpen) {
                acquireToken(instance, inProgress).then(
                  (tokenResult) => {
                    if (!tokenResult) {
                      // TODO: At some point, show some error notification
                      return
                    }
                    if (tokenResult.accessToken) {
                      setIsFetchInProgress(true)
                      HttpClient.get(
                        `/api/ui/admin/companies/hierarchy?businessId=`,
                        getHeaders(tokenResult.accessToken)
                      ).then(
                        (response) => {
                          const hierarchies = response.data.data as CompanyHierarchy[]
                          setHierarchyData(hierarchies)
                          setIsFetchInProgress(false)
                        },
                        (error) => {
                          // TODO: show alert
                          setIsFetchInProgress(false)
                          return Promise.reject(error)
                        }
                      )
                    }
                  },
                  (error) => {
                    // TODO: show alert
                    return Promise.reject(error)
                  }
                )
              }

              setHierarchyDataOpen(!hierarchyDataOpen)
            }}
            className={'hide-control'}
            style={{ marginBottom: '1rem', marginTop: '1rem' }}
          >
            <span className={'text'}>{hierarchyDataOpen ? t('admin:hierarchy:hide') : t('admin:hierarchy:show')}</span>
            <span className={'icon'}>
              <FdsIconComponent icon={!hierarchyDataOpen ? 'chevron-down' : 'chevron-up'} />
            </span>
          </div>
          {hierarchyDataOpen && isFetchInProgress && <LoadSpinner />}
          {hierarchyDataOpen && hierarchyData && (
            <div style={{ backgroundColor: 'var(--Colors-Neutrals-50, #F6F6F6)', padding: '16px' }}>
              {hierarchyData?.map((tree, i) => (
                <Tree
                  updateHierarchyCallback={setHierarchyData}
                  truncated={false}
                  pageCompany={null}
                  hierarchy={tree}
                  key={'tree-' + i}
                  viewOnly={true}
                  noLinks={true}
                  noNodeStyle={true}
                  nodeClickable={true}
                  nodeIncludeBusinessId={true}
                  treeLevelSelectedNodeId={selectedBusinessId}
                  nodeClickCallback={(businessId, companyName, isSelected) => {
                    setSelectedBusinessId(isSelected ? businessId : null)
                    setSelectedCompanyName(isSelected ? companyName : null)

                    if (isSelected && businessId === companyB.businessId) {
                      setError(t('admin:partnership:cannotLinkItself'))
                      return
                    }

                    if (isSelected && linkExists(hierarchyData, businessId)) {
                      setError(
                        t('admin:partnership:linkExists', {
                          companyA: getCompanyName(companyName, t),
                          companyB: getCompanyName(companyB.name, t)
                        })
                      )
                      return
                    }

                    setError(null)
                    setSelectedBusinessId(isSelected ? businessId : null)
                    setSelectedCompanyName(isSelected ? companyName : null)
                    setHierarchyDataOpen(!isSelected)
                  }}
                />
              ))}
            </div>
          )}

          <FdsActionSheetComponent style={{ marginTop: '2rem' }}>
            <FdsButtonComponent
              onClick={close}
              slot="separated"
              icon="x"
              iconSize={FdsTokenSize2}
              variant={FdsButtonVariant.secondary}
              label={t('common:cancel')}
            />
            {selectedBusinessId && !error && (
              <FdsButtonComponent
                variant={FdsButtonVariant.primary}
                iconSize={FdsTokenSize2}
                onClick={() => proceed(selectedBusinessId)}
                label={t('common:proceed')}
              />
            )}
          </FdsActionSheetComponent>
        </FdsCardComponent>
      </FdsDialogComponent>
    </div>
  )
}

export default LinkToNewParentModal
