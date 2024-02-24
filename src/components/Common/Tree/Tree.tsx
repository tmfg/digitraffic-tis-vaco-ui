import './_tree.scss'
import { Company, CompanyHierarchy } from '../../../types/Company'
import { nanoid } from 'nanoid'
import TreeNode from './TreeNode'

/**
 * This tree could have been generic.
 * But that's quite much extra effort while we don't have any feature need for.
 * So, nope.
 */
interface TreeProps {
  pageCompany: Company | null
  hierarchy: CompanyHierarchy
  truncated?: boolean
  updateHierarchyCallback: (c: CompanyHierarchy[]) => void
  viewOnly?: boolean
  noLinks?: boolean
  noNodeStyle?: boolean
  nodeClickable?: boolean
  nodeClickCallback?: (businessId: string, companyName: string, state: boolean) => void
  nodeIncludeBusinessId?: boolean
  treeLevelSelectedNodeId?: string | null
}

const sortNodesAsc = (data: CompanyHierarchy[]): typeof data => {
  return data.sort((a, b) => a.company.name.localeCompare(b.company.name))
}

const Tree = ({
  pageCompany,
  hierarchy,
  truncated,
  updateHierarchyCallback,
  viewOnly,
  noLinks,
  noNodeStyle,
  nodeClickable,
  nodeIncludeBusinessId,
  nodeClickCallback,
  treeLevelSelectedNodeId
}: TreeProps) => {
  const getTreeNode = (
    grandparentCompany: Company | null,
    grandparentCompanyChildren: CompanyHierarchy[],
    parentCompany: Company | null,
    parentCompanyChildren: CompanyHierarchy[],
    company: Company,
    children: CompanyHierarchy[],
    level: number,
    nodeIndex: number,
    prevLevelChildrenCount: number
  ) => {
    return (
      <li key={nanoid()}>
        <div
          className={`node-container ${
            (truncated && children?.length == 0 && company.name !== pageCompany?.name) || noNodeStyle
              ? 'bare-node'
              : 'regular-node'
          }`}
        >
          <div className={'edge-container'}>
            <div className={`${level == 1 ? '' : 'incoming-edge'}`}></div>
            <div
              className={`${
                level !== 1 && prevLevelChildrenCount > 1 && nodeIndex !== prevLevelChildrenCount - 1
                  ? 'continuing-edge'
                  : ''
              }`}
            />
          </div>
          <TreeNode
            updateHierarchyCallback={updateHierarchyCallback}
            grandparentCompany={grandparentCompany}
            grandparentCompanyChildren={grandparentCompanyChildren}
            parentCompany={parentCompany}
            nodeCompany={company}
            pageCompany={pageCompany}
            level={level}
            viewOnly={viewOnly}
            noLinks={noLinks}
            nodeClickable={nodeClickable}
            nodeClickCallback={nodeClickCallback}
            nodeIncludeBusinessId={nodeIncludeBusinessId}
            treeLevelSelectedNodeId={treeLevelSelectedNodeId}
          />
        </div>
        {children?.length > 0 && (
          <ul
            className={`${
              prevLevelChildrenCount > 1 && nodeIndex !== prevLevelChildrenCount - 1 ? 'inner-level' : 'last-level'
            }`}
            key={nanoid()}
          >
            {children?.map((h, i) =>
              getTreeNode(
                parentCompany,
                parentCompanyChildren,
                company,
                children,
                h.company,
                sortNodesAsc(h.children),
                ++level,
                i,
                children?.length
              )
            )}
          </ul>
        )}
      </li>
    )
  }

  return (
    <ul className={`root-level`}>
      {getTreeNode(null, [], null, [], hierarchy.company, sortNodesAsc(hierarchy.children), 1, 1, 0)}
    </ul>
  )
}

export default Tree
