import '../Table/_dropdown-menu.scss'
import './_treeNode.scss'
import { AppContext, AppContextType } from '../../../AppContextProvider'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Company, CompanyHierarchy, SwapPartnershipRequest } from '../../../types/Company'
import { rolesContainVacoAdmin, rolesContainVacoCompanyAdmin } from '../../../util/role'
import { nanoid } from 'nanoid'
import { ReactComponent as ActionMenuSvg } from '../../../assets/svg/action_menu.svg'
import { ReactComponent as RemoveSvg } from '../../../assets/svg/remove.svg'
import { ReactComponent as MoveUpSvg } from '../../../assets/svg/move_up.svg'
import { useNavigate } from 'react-router-dom'
import { acquireToken } from '../../../hooks/auth'
import { useMsal } from '@azure/msal-react'
import { getHeaders, HttpClient } from '../../../HttpClient'
import RemovePartnershipModal from '../../CompanyInfo/RemovePartnershipModal'
import MoveUpPartnershipModal from '../../CompanyInfo/MoveUpPartnershipModal'
import { useTranslation } from 'react-i18next'
import { getCompanyName } from '../../../util/company'

interface TreeNodeProps {
  grandparentCompany: Company | null
  grandparentCompanyChildren: CompanyHierarchy[]
  parentCompany: Company | null
  nodeCompany: Company
  pageCompany: Company | null
  level: number
  updateHierarchyCallback: (c: CompanyHierarchy[]) => void
  viewOnly?: boolean
  noLinks?: boolean
  nodeClickable?: boolean
  nodeClickCallback?: (businessId: string, companyName: string, state: boolean) => void
  nodeIncludeBusinessId?: boolean
  treeLevelSelectedNodeId?: string | null
}

const TreeNode = ({
  grandparentCompany,
  grandparentCompanyChildren,
  parentCompany,
  nodeCompany,
  pageCompany,
  level,
  updateHierarchyCallback,
  viewOnly,
  noLinks,
  nodeClickable,
  nodeClickCallback,
  nodeIncludeBusinessId,
  treeLevelSelectedNodeId
}: TreeNodeProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { instance, inProgress } = useMsal()
  const [nodeId] = useState(nanoid())
  const appContext: AppContextType = useContext(AppContext)
  const [hasAdminRole, setHasAdminRole] = useState<boolean | undefined>(undefined)
  const [hasCompanyAdminRole, setHasCompanyAdminRole] = useState<boolean | undefined>(undefined)
  const [userCompanies, setUserCompanies] = useState<Company[] | undefined>(undefined)
  const [actionMenuOpen, setActionMenuOpen] = useState<boolean>(false)
  const [moveUpPartnershipModalShown, setMoveUpPartnershipModalShown] = useState<boolean>(false)
  const [removePartnershipModalShown, setRemovePartnershipModalShown] = useState<boolean>(false)

  const hasRightToViewOrEditNode = (businessId: string) => {
    return hasAdminRole || (hasCompanyAdminRole && userCompanies?.map((c) => c.businessId).includes(businessId))
  }

  useEffect(() => {
    if (appContext?.roles) {
      setHasAdminRole(rolesContainVacoAdmin(appContext.roles))
      setHasCompanyAdminRole(rolesContainVacoCompanyAdmin(appContext.roles))
    }
    if (appContext?.companies) {
      setUserCompanies(appContext.companies)
    }
  }, [appContext])

  const removePartnership = () => {
    acquireToken(instance, inProgress).then(
      (tokenResult) => {
        if (!tokenResult) {
          // TODO: At some point, show some error notification
          return
        }

        HttpClient.delete(
          `/api/ui/admin/partnership?partnerABusinessId=${parentCompany?.businessId}&partnerBBusinessId=${nodeCompany.businessId}`,
          getHeaders(tokenResult.accessToken)
        ).then(
          (response) => {
            updateHierarchyCallback(response.data?.data as CompanyHierarchy[])
          },
          (error) => {
            // Show some error
            return Promise.reject(error)
          }
        )
      },
      (error) => {
        // TODO: show alert
        return Promise.reject(error)
      }
    )
  }

  const moveUpPartnership = () => {
    acquireToken(instance, inProgress).then(
      (tokenResult) => {
        if (!tokenResult) {
          // TODO: At some point, show some error notification
          return
        }

        const request: SwapPartnershipRequest = {
          oldPartnerABusinessId: parentCompany?.businessId,
          newPartnerABusinessId: grandparentCompany?.businessId,
          partnerBBusinessId: nodeCompany.businessId
        }

        HttpClient.post(`/api/ui/admin/partnership/swap`, request, getHeaders(tokenResult.accessToken)).then(
          (response) => {
            updateHierarchyCallback(response.data?.data as CompanyHierarchy[])
          },
          (error) => {
            // Show some error
            return Promise.reject(error)
          }
        )
      },
      (error) => {
        // TODO: show alert
        return Promise.reject(error)
      }
    )
  }

  const handleOutsideNodeActionsMenuClick = useCallback(
    (e: Event) => {
      const targets = e.composedPath() as Element[]
      if (
        !targets.some((target) => {
          return target.id === 'action-button-' + nodeId || target.id === 'action-menu-' + nodeId
        })
      ) {
        document.removeEventListener('click', handleOutsideNodeActionsMenuClick)
        setActionMenuOpen(false)
      }
    },
    [nodeId]
  )

  useEffect(() => {
    const menu = document.querySelector('[id="action-menu-' + nodeId + '"]')
    if (menu) {
      document.addEventListener('click', handleOutsideNodeActionsMenuClick)
    }
    return () => {}
  }, [actionMenuOpen, handleOutsideNodeActionsMenuClick, nodeId])

  return (
    <div
      onClick={() => {
        if (nodeClickable && nodeClickCallback) {
          nodeClickCallback(
            nodeCompany.businessId,
            nodeCompany.name,
            nodeCompany.businessId !== treeLevelSelectedNodeId
          )
        }
      }}
      className={`tree-node ${level == 1 ? 'root-node' : ''} ${
        nodeCompany.name === pageCompany?.name ? 'focused-node' : ''
      } ${nodeCompany.businessId === treeLevelSelectedNodeId ? 'selected-node' : ''}`}
    >
      {
        // Company admin cannot navigate to company info page if he/she doesn't belong to that company
        hasRightToViewOrEditNode(nodeCompany.businessId) && !noLinks ? (
          <div
            onClick={(e) => {
              e.preventDefault()
              navigate('/admin/companies/' + nodeCompany.businessId + '/info', { state: nanoid() })
            }}
            className={'tree-node-link'}
          >
            {getCompanyName(nodeCompany.name, t)}
            {nodeIncludeBusinessId && <span className={'node-detail-info'}>({nodeCompany.businessId})</span>}
          </div>
        ) : (
          <div>
            {getCompanyName(nodeCompany.name, t)}
            {nodeIncludeBusinessId && <span className={'node-detail-info'}>({nodeCompany.businessId})</span>}
          </div>
        )
      }

      {removePartnershipModalShown && (
        <RemovePartnershipModal
          companyA={parentCompany?.name}
          companyB={nodeCompany.name}
          proceed={removePartnership}
          close={() => setRemovePartnershipModalShown(false)}
        />
      )}

      {moveUpPartnershipModalShown && (
        <MoveUpPartnershipModal
          oldCompanyA={parentCompany?.name}
          newCompanyA={grandparentCompany?.name}
          companyB={nodeCompany.name}
          proceed={moveUpPartnership}
          close={() => setMoveUpPartnershipModalShown(false)}
        />
      )}

      {!viewOnly &&
        parentCompany &&
        nodeCompany.name === pageCompany?.name &&
        hasRightToViewOrEditNode(nodeCompany.businessId) && (
          <div id={'action-button-' + nodeId} className={'action-wrapper'}>
            <button className={'node-action'} onClick={() => setActionMenuOpen(!actionMenuOpen)}>
              <ActionMenuSvg />
            </button>
            {actionMenuOpen && (
              <ul id={'action-menu-' + nodeId} className={'menu'}>
                {grandparentCompany &&
                  !grandparentCompanyChildren.map((c) => c.company.businessId).includes(nodeCompany.businessId) && (
                    <li
                      onClick={() => {
                        setMoveUpPartnershipModalShown(true)
                      }}
                    >
                      <span className={'li-sort-icon'}>
                        <MoveUpSvg />
                      </span>
                      <span>{t('admin:partnership:moveUp')}</span>
                    </li>
                  )}
                <li
                  onClick={() => {
                    setRemovePartnershipModalShown(true)
                  }}
                >
                  <span className={'li-sort-icon'}>
                    <RemoveSvg />
                  </span>
                  <span>{t('admin:partnership:remove')}</span>
                </li>
              </ul>
            )}
          </div>
        )}
    </div>
  )
}

export default TreeNode
