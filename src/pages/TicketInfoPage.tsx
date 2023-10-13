import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getHeaders, HttpClient } from '../HttpClient'
import { EntryResource } from '../types/EntryResource'
import { acquireToken } from '../hooks/auth'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import AuthRequiredPage from './errors/AuthRequiredPage'

const TicketInfoPage = () => {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState<EntryResource | null>(null)
  const { instance } = useMsal()

  useEffect(() => {
    let ignore = false
    setTicket(null)
    if (ticketId) {
      acquireToken(instance).then(
        (tokenResult) => {
          if (!tokenResult) {
            // TODO: At some point, show some error notification
            return
          }

          HttpClient.get('/api/queue/' + ticketId, getHeaders(tokenResult.idToken)).then(
            (response) => {
              if (!ignore) {
                setTicket(response.data)
              }
            },
            (error) => {
              return Promise.reject(error)
            }
          )
        },
        (error) => {
          return Promise.reject(error)
        }
      )

      return () => {
        ignore = true
      }
    }
  }, [ticketId, instance])

  return (
    <div className={'sub-page'}>
      <AuthenticatedTemplate>
        <h2>Ticket info</h2>
        {ticket && (
          <pre style={{ width: 900, whiteSpace: 'pre-wrap' }}>
            <code> {JSON.stringify(ticket)}</code>
          </pre>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <AuthRequiredPage />
      </UnauthenticatedTemplate>
    </div>
  )
}

export default TicketInfoPage
