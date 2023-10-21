import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import TicketCreationPage from './pages/TicketCreationPage'
import TicketInfoPage from './pages/TicketInfoPage'
import AppLayout from './AppLayout'
import AuthRequiredPage from './pages/errors/AuthRequiredPage'

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
          },
          {
            path: '*',
            element: <NotFoundPage />
          },
          {
            path: '/error/auth',
            element: <AuthRequiredPage />
          }
        ]
      }
    ],
    {
      basename: import.meta.env.BASE_URL
    }
  )

  return <RouterProvider router={router} />
}

export default App
