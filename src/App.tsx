import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/errors/NotFoundPage'
import FintrafficBar from './components/FintrafficBar'
import Footer from './components/Footer'
import VacoNavbar from './components/VacoNavbar'
import DashboardPage from './pages/DashboardPage'
import TicketCreationPage from './pages/TicketCreationPage'
import TicketInfoPage from './pages/TicketInfoPage'

const AppLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FintrafficBar />
      <VacoNavbar />
      <Outlet />
      <Footer />
    </div>
  )
}

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

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
