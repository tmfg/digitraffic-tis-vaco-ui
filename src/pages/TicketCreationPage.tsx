import { useState } from 'react'
import { HttpClient } from '../HttpClient'

const TicketCreationPage = () => {
  const [creationResponse, setCreationResponse] = useState({})

  const yikes = async () => {
    const requestBody = {
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

    const response = await HttpClient.post('/queue', requestBody)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setCreationResponse(response.data)
  }

  return (
    <div>
      <h1>Create ticket</h1>
      {creationResponse && Object.keys(creationResponse).length > 0 && (
        <div
          style={{
            fontFamily: 'PublicSans-Medium',
            marginLeft: 25
          }}
        >
          <h2>Submitted! </h2>
          <pre style={{ width: 600, whiteSpace: 'pre-wrap' }}>{JSON.stringify(creationResponse)}</pre>
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
        Launch {Object.keys(creationResponse).length > 0 && 'again'}!
      </button>
    </div>
  )
}

export default TicketCreationPage
