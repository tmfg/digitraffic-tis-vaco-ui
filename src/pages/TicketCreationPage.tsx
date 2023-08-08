import { useState } from 'react'
import { HttpClient } from '../HttpClient'
import { EntryRequest } from '../types/EntryRequest'
import { EntryResource } from '../types/EntryResource'
import { Link } from 'react-router-dom'

const TicketCreationPage = () => {
  const [entryResource, setEntryResource] = useState<EntryResource | null>(null)

  const yikes = async () => {
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
      <button
        onClick={yikes}
        style={{
          marginTop: 25,
          fontFamily: 'PublicSans-Medium',
          backgroundColor: '#0034ac',
          color: 'white',
          width: 125,
          marginLeft: 25,
          paddingTop: 18,
          paddingBottom: 18,
          fontSize: '1.2rem',
          cursor: 'pointer'
        }}
      >
        Launch {entryResource && 'again'}!
      </button>
    </div>
  )
}

export default TicketCreationPage
