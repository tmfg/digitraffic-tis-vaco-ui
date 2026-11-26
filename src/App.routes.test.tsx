import { act, render, screen } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MsalProvider } from '@azure/msal-react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import { appChildRoutes } from './App'
import { bootstrapParams, msalInitTester, resetTester } from './test/unit/vitestSetup'
import { server } from './test/unit/mocks/server'
import { initializeBootstrap } from './hooks/auth'

describe('Old admin URLs', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    server.use(
      http.get('http://localhost:8080/api/ui/data-delivery', () => HttpResponse.json([], { status: 200 })),
      http.get('http://localhost:8080/api/ui/pages/company-entries/:businessId', () =>
        HttpResponse.json({ data: { entries: [] }, error: null, links: {} }, { status: 200 })
      )
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderAt = async (url: string) => {
    const router = createMemoryRouter(appChildRoutes, { initialEntries: [url] })
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <RouterProvider router={router} />
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
    return router
  }

  it('redirects /admin/data-delivery to the public data delivery page for a visitor', async () => {
    await msalTester.isNotLogged()
    const router = await renderAt('/admin/data-delivery')

    expect(router.state.location.pathname).toBe('/data')
    expect(screen.getByText(i18next.t('admin:dataDelivery:header'))).toBeInTheDocument()
  })

  it('redirects the old company page and keeps the query string', async () => {
    await msalTester.isNotLogged()
    const router = await renderAt('/admin/companies/2942108-7/data?companyName=Fintraffic')

    expect(router.state.location.pathname).toBe('/data/companies/2942108-7')
    expect(router.state.location.search).toBe('?companyName=Fintraffic')
  })
})
