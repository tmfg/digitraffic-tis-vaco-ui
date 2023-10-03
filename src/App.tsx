import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MsalAuthenticationTemplate } from '@azure/msal-react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import TicketCreationPage from './pages/TicketCreationPage'
import TicketInfoPage from './pages/TicketInfoPage'
import AppLayout from './AppLayout'
import { InteractionType } from '@azure/msal-browser'
import { loginRequest } from './authConfig'

// The way for components that don't need wrapping (e.g. one without our own custom events)
// or while initial testing
/*declare global {
  namespace JSX {
    interface IntrinsicElements {
      'fds-button': { label?: string; icon?: string }
    }
  }
}*/

const App = () => {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />
          },
          {
            path: '/dashboard',
            element: <DashboardPage />
          },
          {
            path: '/ticket/request',
            element: <TicketCreationPage />
          },
          {
            path: '/ticket/info/:ticketId',
            element: <TicketInfoPage />
          },
          {
            path: '/ticket/info',
            element: <TicketInfoPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ],
    { basename: '/ui' }
  )

  return (
    <MsalAuthenticationTemplate authenticationRequest={loginRequest} interactionType={InteractionType.Redirect}>
      <RouterProvider router={router} />
    </MsalAuthenticationTemplate>
  )
}

export default App
