import { act, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import TestResultsPage from './TestResultsPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'

describe('Test Results Page', () => {
  let msalTester: MsalReactTester
  let authorizationHeaders: (string | null)[]

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    authorizationHeaders = []
    server.use(
      http.get('http://localhost:8080/api/ui/data-delivery/test-results', ({ request }) => {
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
            <TestResultsPage />
          </MemoryRouter>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
  }

  it('fetches the test results without a token when user is not logged in', async () => {
    await msalTester.isNotLogged()
    await renderPage()

    expect(screen.getByText(i18next.t('vaco:testResults'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
    await waitFor(() => expect(authorizationHeaders).toHaveLength(1))
    expect(authorizationHeaders[0]).toBeNull()
  })

  it('fetches the test results with a token when user is logged in', async () => {
    await msalTester.isLogged()
    await renderPage()

    await waitFor(() => expect(authorizationHeaders.length).toBeGreaterThan(0))
    expect(authorizationHeaders.every((header) => header !== null)).toBe(true)
  })

  it('has no export button', async () => {
    await msalTester.isNotLogged()
    await renderPage()

    expect(screen.queryByText('Export CSV')).toBeNull()
  })
})
