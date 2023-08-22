import { useState } from 'react'
import { HttpClient } from '../HttpClient'
import { EntryRequest } from '../types/EntryRequest'
import { EntryResource } from '../types/EntryResource'
import { Link } from 'react-router-dom'
import { FdsButtonComponent } from '../components/fds/FdsButtonComponent'

const TicketCreationPage = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)

  const submitTicket = async () => {
    const requestBody: EntryRequest = {
      url: 'http://localhost:8080/stuff.zip',
      format: 'gtfs',
      businessId: '2942108-7',
      etag: 'etagg',
      validation: {},
      metadata: {
        brewingEquipment: 'teapot',
        'capacity (ml)': 1500
      }
    }

    const { data } = await HttpClient.post('/queue', requestBody)
    setEntryResource(data)
  }

  return (
    <div>
      <h1>Create ticket</h1>
      {entryResource && (
        <div
          style={{
            fontFamily: 'PublicSans-Medium',
            marginLeft: 25
          }}
        >
          <h2>
            Submitted! Ticket:
            <Link to={'/ticket/info/' + entryResource.data.publicId}>{entryResource.data.publicId}</Link>
          </h2>
          <pre style={{ width: 700, whiteSpace: 'pre-wrap' }}>{JSON.stringify(entryResource)}</pre>
        </div>
      )}
      <FdsButtonComponent onClick={submitTicket} label={`Launch${entryResource ? ' again' : ''}!`} />
    </div>
  )
}

export default TicketCreationPage
