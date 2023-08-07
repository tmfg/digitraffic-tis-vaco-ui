import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import DashboardPage from './pages/DashboardPage'
import TicketCreationPage from './pages/TicketCreationPage'
import TicketInfoPage from './pages/TicketInfoPage'
import AppLayout from './AppLayout'

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
          path: '/ticket/info/:publicId',
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
