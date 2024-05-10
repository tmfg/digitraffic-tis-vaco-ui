import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { downloadFile } from '../../util/download'
import { PackageResource } from '../../types/Package'
import { useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'

interface PackageButtonProps {
  entryPackage: PackageResource
}

const PackageButton = ({ entryPackage }: PackageButtonProps) => {
  const { instance, inProgress } = useMsal()
  const { t, i18n } = useTranslation()

  return (
    <span style={{ marginRight: '2.5rem' }}>
      <FdsButtonComponent
        variant={FdsButtonVariant.primary}
        icon="download"
        onClick={() => {
          acquireToken(instance, inProgress).then(
            (tokenResult) => {
              if (!tokenResult) {
                // TODO: At some point, show some error notification
                return
              }
              HttpClient.get(entryPackage.links.refs.self.href, {
                ...getHeaders(tokenResult.accessToken),
                responseType: 'blob'
              }).then(
                (response) => {
                  downloadFile(response.data, entryPackage.data.name + '.zip', response.data.type)
                },
                (error) => {
                  // TODO: show alert
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
        label={
          i18n .exists('services:processingResults:packages:' + entryPackage.data.name)
            ? t('services:processingResults:packages:' + entryPackage.data.name)
            : entryPackage.data.name
        }
      />
    </span>
  )
}

export default PackageButton
