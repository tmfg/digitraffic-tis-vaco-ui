import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/Error/NotFoundPage'
import TestDataPage from './pages/TestData/TestDataPage'
import ProcessingResultsPage from './pages/ProcessingResults/ProcessingResultsPage'
import AppLayout from './AppLayout'
import AuthRequiredPage from './pages/Error/AuthRequiredPage'
import MyDataPage from './pages/MyData/MyDataPage'
import UserPage from './pages/User/UserPage'
import DataDeliveryPage from './pages/AdminTools/DataDeliveryPage'
import CompanyEntriesPage from './pages/AdminTools/CompanyEntriesPage'
import CompaniesPage from "./pages/AdminTools/CompaniesPage";
import CompanyInfoPage from "./pages/AdminTools/CompanyInfoPage";

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
            path: '/data/request',
            element: <TestDataPage />
          },
          {
            path: '/data/:entryId',
            element: <ProcessingResultsPage />
          },
          {
            path: '/data',
            element: <MyDataPage />
          },
          {
            path: '*',
            element: <NotFoundPage />
          },
          {
            path: '/error/auth',
            element: <AuthRequiredPage />
          },
          {
            path: '/user',
            element: <UserPage />
          },
          {
            path: '/admin/data-delivery',
            element: <DataDeliveryPage />
          },
          {
            path: '/admin/companies/:businessId/data',
            element: <CompanyEntriesPage />
          },
          {
            path: '/admin/companies',
            element: <CompaniesPage />
          },
          {
            path: 'admin/companies/:businessId/info',
            element: <CompanyInfoPage />
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
