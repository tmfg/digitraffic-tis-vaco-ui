import { useState } from 'react'
import { HttpClient } from '../HttpClient'
import { EntryRequest } from '../types/EntryRequest'
import { EntryResource } from '../types/EntryResource'
import { Link } from 'react-router-dom'
import { FdsButtonComponent } from '../components/fds/FdsButtonComponent'
import { FdsNavigationItem } from '@fintraffic-design/coreui-components/src/fds-navigation'
import { vacoStaticNavbarItems } from '../components/VacoNavbar'

const TicketCreationPage = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)

  const submitTicket = async () => {
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

    const { data } = await HttpClient.post('/queue', requestBody)
    setEntryResource(data)
  }

  return (
    <div className={'sub-page'}>
      <h2>Create ticket</h2>
      {entryResource && (
        <div>
          <h4>
            Submitted! Ticket:
            <Link
              onClick={() => {
                // VACO navbar should update selected menu item:
                const element = document.getElementsByTagName('fds-navigation-test')[1]
                element?.dispatchEvent(
                  new CustomEvent<FdsNavigationItem>('externalNavigation', {
                    detail: vacoStaticNavbarItems[3],
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
      <FdsButtonComponent
        icon={'alert-circle'}
        onClick={submitTicket}
        label={`Launch${entryResource ? ' again' : ''}!`}
      />
    </div>
  )
}

export default TicketCreationPage
