import { FdsButtonComponent } from '../fds/FdsButtonComponent'
import { acquireToken } from '../../hooks/auth'
import { getHeaders, HttpClient } from '../../HttpClient'
import { downloadFile } from '../../util/download'
import { PackageResource } from '../../types/Package'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { useTranslation } from 'react-i18next'
import { FdsButtonVariant } from '../../../coreui-components/src/fds-button'

interface PackageButtonProps {
  entryPackage: PackageResource
}

const PackageButton = ({ entryPackage }: PackageButtonProps) => {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const { t, i18n } = useTranslation()

  const download = (token: string | null) => {
    HttpClient.get(entryPackage.links.refs.self.href, {
      ...getHeaders(token),
      responseType: 'blob'
    })
      .then((response) => {
        downloadFile(response.data, entryPackage.data.name + '.zip', response.data.type)
      })
      .catch((error) => console.error('Package download error', error))
  }

  return (
    <span style={{ marginRight: '2.5rem' }}>
      <FdsButtonComponent
        variant={FdsButtonVariant.primary}
        icon="download"
        onClick={() => {
          if (!isAuthenticated) {
            // The server serves most packages to a visitor, so no token is needed.
            download(null)
            return
          }
          acquireToken(instance, inProgress)
            .then((tokenResult) => {
              if (!tokenResult) {
                // TODO: At some point, show some error notification
                return
              }
              download(tokenResult.accessToken)
            })
            .catch((error) => console.error('Token acquisition error', error))
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
