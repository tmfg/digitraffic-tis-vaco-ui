import './_hierarchy.scss'
import Tree from '../Common/Tree/Tree'
import { Company, CompanyHierarchy, CreatePartnershipRequest } from '../../types/Company'
import Section from '../Common/Section/Section'
import { useEffect, useState } from 'react'
import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { FdsTokenSize2 } from '../../../coreui-css/lib'
import { useTranslation } from 'react-i18next'
import LinkToNewParentModal from './LinkToNewParentModal'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { useMsal } from '@azure/msal-react'

interface CompanyHierarchyProps {
  company: Company
  hierarchies: CompanyHierarchy[]
}

const CompanyHierarchyTree = ({ company, hierarchies }: CompanyHierarchyProps) => {
  const { t } = useTranslation()
  const { instance, inProgress } = useMsal()
  const [hierarchyState, setHierarchyState] = useState<CompanyHierarchy[]>(hierarchies)
  const [isLinkToModalShown, setIsLinkToModalShown] = useState<boolean>(false)

  useEffect(() => {
    setHierarchyState(hierarchies)
  }, [hierarchies])

  return (
    <Section titleKey={'admin:hierarchy:header'} hidable={true}>
      <div className={'company-hierarchy'}>
        {hierarchyState?.map((tree, i) => (
          <Tree
            updateHierarchyCallback={setHierarchyState}
            truncated={true}
            pageCompany={company}
            hierarchy={tree}
            key={'tree-' + i}
          />
        ))}
        <FdsButtonComponent
          style={{ marginBottom: '2.5rem', marginTop: '2rem' }}
          icon="plus"
          iconSize={FdsTokenSize2}
          onClick={() => {
            setIsLinkToModalShown(true)
          }}
          label={t('admin:partnership:link')}
        />
        {isLinkToModalShown && company && (
          <LinkToNewParentModal
            close={() => {
              setIsLinkToModalShown(false)
            }}
            proceed={(parnerABusinessId: string | null) => {
              setIsLinkToModalShown(false)
              if (!parnerABusinessId) {
                return
              }
              acquireToken(instance, inProgress).then(
                (tokenResult) => {
                  if (!tokenResult) {
                    // TODO: At some point, show some error notification
                    return
                  }

                  const request: CreatePartnershipRequest = {
                    //type: 'authority-provider',
                    partnerABusinessId: parnerABusinessId,
                    partnerBBusinessId: company.businessId
                  }

                  HttpClient.post(`/api/ui/admin/partnership`, request, getHeaders(tokenResult.accessToken)).then(
                    (response) => {
                      setHierarchyState(response.data?.data as CompanyHierarchy[])
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
            }}
            companyB={company}
          />
        )}
      </div>
    </Section>
  )
}

export default CompanyHierarchyTree
