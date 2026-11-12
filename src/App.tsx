import './App.css'
import { createBrowserRouter, Navigate, RouterProvider, useLocation, useParams } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/Error/NotFoundPage'
import TestDataPage from './pages/TestData/TestDataPage'
import ProcessingResultsPage from './pages/ProcessingResults/ProcessingResultsPage'
import AppLayout from './AppLayout'
import AuthRequiredPage from './pages/Error/AuthRequiredPage'
import MyAccount from './pages/User/MyAccount'
import DataDeliveryPage from './pages/AdminTools/DataDelivery/DataDeliveryPage'
import CompanyEntriesPage from './pages/AdminTools/CompanyEntries/CompanyEntriesPage'
import CompaniesPage from './pages/AdminTools/Companies/CompaniesPage'
import CompanyInfoPage from './pages/AdminTools/CompanyInfo/CompanyInfoPage'
import FeatureFlagsPage from './pages/AdminTools/FeatureFlags/FeatureFlagsPage'
import StatisticsPage from './pages/AdminTools/Statistics/StatisticsPage.tsx'

// The way for components that don't need wrapping (e.g. one without our own custom events)
// or while initial testing
/*declare global {
  namespace JSX {
    interface IntrinsicElements {
      'fds-button': { label?: string; icon?: string }
    }
  }
}*/

// Old bookmarks of the admin company page keep working, and keep the company name in the query string.
const CompanyEntriesRedirect = () => {
  const { businessId } = useParams()
  const { search } = useLocation()
  return <Navigate to={'/data/companies/' + businessId + search} replace />
}

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
            path: '/data/companies/:businessId',
            element: <CompanyEntriesPage />
          },
          {
            path: '/data/:entryId',
            element: <ProcessingResultsPage />
          },
          {
            path: '/data',
            element: <DataDeliveryPage />
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
            element: <MyAccount />
          },
          {
            path: '/admin/data-delivery',
            element: <Navigate to="/data" replace />
          },
          {
            path: '/admin/companies/:businessId/data',
            element: <CompanyEntriesRedirect />
          },
          {
            path: '/admin/companies',
            element: <CompaniesPage />
          },
          {
            path: 'admin/companies/:businessId/info',
            element: <CompanyInfoPage />
          },
          {
            path: '/admin/feature-flags',
            element: <FeatureFlagsPage />
          },
          {
            path: '/admin/statistics',
            element: <StatisticsPage/>
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
