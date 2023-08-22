import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import TicketCreationPage from './pages/TicketCreationPage'
import TicketInfoPage from './pages/TicketInfoPage'
import AppLayout from './AppLayout'

// The way for components that don't need wrapping (e.g. one without our own custom events)
// or while initial testing
/*declare global {
  namespace JSX {
    interface IntrinsicElements {
      'fds-button': { label?: string; icon?: string }
      'fds-test': {}
      'fds-test2': {}
    }
  }
}*/

const App = () => {
  const router = createBrowserRouter([
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
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
