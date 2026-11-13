import { act, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import CompanyEntriesPage from './CompanyEntriesPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../../test/unit/vitestSetup'
import { server } from '../../../test/unit/mocks/server'
import { initializeBootstrap } from '../../../hooks/auth'

describe('Company Entries Page', () => {
  let msalTester: MsalReactTester
  let requests: { businessId: string | undefined; authorization: string | null }[]

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    requests = []
    server.use(
      http.get('http://localhost:8080/api/ui/pages/company-entries/:businessId', ({ request, params }) => {
        requests.push({ businessId: params.businessId as string, authorization: request.headers.get('Authorization') })
        return HttpResponse.json({ data: { entries: [] }, error: null, links: {} }, { status: 200 })
      })
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  it('renders and fetches the company entries without a token when user is not logged in', async () => {
    await msalTester.isNotLogged()

    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter initialEntries={['/data/companies/2942108-7?companyName=Fintraffic']}>
            <Routes>
              <Route path="/data/companies/:businessId" element={<CompanyEntriesPage />} />
            </Routes>
          </MemoryRouter>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()

    expect(screen.getByText(i18next.t('services:myData:find'))).toBeInTheDocument()
    expect(screen.queryByText(i18next.t('error:authRequired'))).toBeNull()
    await waitFor(() => expect(requests).toHaveLength(1))
    expect(requests[0].businessId).toBe('2942108-7')
    expect(requests[0].authorization).toBeNull()
  })
})
