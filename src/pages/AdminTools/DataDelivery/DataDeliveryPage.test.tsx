import { act, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import DataDeliveryPage from './DataDeliveryPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../../test/unit/vitestSetup'
import { server } from '../../../test/unit/mocks/server'
import { initializeBootstrap } from '../../../hooks/auth'

describe('Data Delivery Page', () => {
  let msalTester: MsalReactTester
  let authorizationHeaders: (string | null)[]

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    authorizationHeaders = []
    server.use(
      http.get('http://localhost:8080/api/ui/data-delivery', ({ request }) => {
        authorizationHeaders.push(request.headers.get('Authorization'))
        return HttpResponse.json([], { status: 200 })
      })
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderPage = async () => {
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter>
            <DataDeliveryPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
  }

  it('renders and fetches the deliveries without a token when user is not logged in', async () => {
    await msalTester.isNotLogged()
    await renderPage()

    expect(screen.getByText(i18next.t('admin:dataDelivery:header'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
    await waitFor(() => expect(authorizationHeaders).toHaveLength(1))
    expect(authorizationHeaders[0]).toBeNull()
  })

  it('renders and fetches the deliveries with a token when user is logged in', async () => {
    await msalTester.isLogged()
    await renderPage()

    expect(screen.getByText(i18next.t('admin:dataDelivery:header'))).toBeInTheDocument()
    await waitFor(() => expect(authorizationHeaders.length).toBeGreaterThan(0))
  })
})
