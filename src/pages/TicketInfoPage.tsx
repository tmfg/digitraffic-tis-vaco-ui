import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HttpClient } from '../HttpClient'
import { EntryResource } from '../types/EntryResource'

const TicketInfoPage = () => {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState<EntryResource | null>(null)

  useEffect(() => {
    let ignore = false
    setTicket(null)
    if (ticketId) {
      HttpClient.get('/queue/' + ticketId).then(
        (response) => {
          if (!ignore) {
            setTicket(response.data)
          }
        },
        (error) => {
          return Promise.reject(error)
        }
      )

      return () => {
        ignore = true
      }
    }
  }, [ticketId])

  return (
    <div>
      <h1>Ticket info</h1>
      {ticket && (
        <pre style={{ width: 900, whiteSpace: 'pre-wrap', marginLeft: 25 }}>
          <code> {JSON.stringify(ticket)}</code>
        </pre>
      )}
    </div>
  )
}

export default TicketInfoPage
