import { useState } from 'react'
import { getHeaders, HttpClient } from '../HttpClient'
import { EntryRequest } from '../types/EntryRequest'
import { EntryResource } from '../types/EntryResource'
import { Link } from 'react-router-dom'
import { FdsButtonComponent } from '../components/fds/FdsButtonComponent'
import { FdsNavigationItem } from '../../coreui-components/src/fds-navigation'
import { vacoNavbarItems } from '../components/Navigation/VacoAuthenticatedNavbar'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { acquireToken } from '../hooks/auth'
import AuthRequiredPage from './errors/AuthRequiredPage'

const TicketCreationPage = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)
  const { instance } = useMsal()

  const submitTicket = async () => {
    const tokenResult = await acquireToken(instance)
    if (!tokenResult) {
      // TODO: At some point, show some error notification
      return
    }

    const requestBody: EntryRequest = {
      url: 'https://tvv.fra1.digitaloceanspaces.com/249.zip',
      format: 'gtfs',
      businessId: '2942108-7',
      etag: 'etagg',
      validation: [
        {
          name: 'gtfs.canonical.v4_0_0',
          config: { lol: 'apua', muumi: 'pappa' }
        }
      ],
      metadata: {
        brewingEquipment: 'teapot',
        'capacity (ml)': 1500
      }
    }

    const { data } = await HttpClient.post('/api/queue', requestBody, getHeaders(tokenResult.idToken))
    setEntryResource(data)
  }

  return (
    <div className={'sub-page'}>
      <AuthenticatedTemplate>
        <h2>Create ticket</h2>
        {entryResource && (
          <div>
            <h4>
              Submitted! Ticket:
              <Link
                onClick={() => {
                  // VACO navbar should update selected menu item:
                  const element = document.getElementsByTagName('fds-navigation')[1]
                  element?.dispatchEvent(
                    new CustomEvent<FdsNavigationItem>('externalNavigation', {
                      detail: vacoNavbarItems[4],
                      bubbles: true
                    })
                  )
                }}
                to={'/ticket/info/' + entryResource.data.publicId}
              >
                {entryResource.data.publicId}
              </Link>
            </h4>
            <pre style={{ width: 700, whiteSpace: 'pre-wrap' }}>{JSON.stringify(entryResource)}</pre>
          </div>
        )}
        <FdsButtonComponent onClick={submitTicket} label={`Launch${entryResource ? ' again' : ''}!`} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default TicketCreationPage
