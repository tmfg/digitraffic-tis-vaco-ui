import { act, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MsalProvider } from '@azure/msal-react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import i18next from 'i18next'
import { appChildRoutes } from '../../App'
import { AppContext } from '../../AppContextProvider'
import { Company } from '../../types/Company'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'

const company = (businessId: string, name: string): Company => ({ businessId, name, publish: false, roles: [] })

describe('Test results page', () => {
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

  const renderAt = async (companies: Company[] | undefined) => {
    const router = createMemoryRouter(appChildRoutes, { initialEntries: ['/data', '/data/results'], initialIndex: 1 })
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <AppContext.Provider value={{ companies, roles: undefined }}>
            <RouterProvider router={router} />
          </AppContext.Provider>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
    return router
  }

  it('sends a visitor to the public validation test company', async () => {
    await msalTester.isNotLogged()
    const router = await renderAt(undefined)

    expect(router.state.location.pathname).toBe('/data/companies/public-validation-test-id')
  })

  it('sends a logged-in user without a company to the public validation test company', async () => {
    await msalTester.isLogged()
    const router = await renderAt([])

    expect(router.state.location.pathname).toBe('/data/companies/public-validation-test-id')
  })

  it('sends a logged-in user whose only company is the public validation test company to that company', async () => {
    await msalTester.isLogged()
    const router = await renderAt([company('public-validation-test-id', 'Public validation test')])

    expect(router.state.location.pathname).toBe('/data/companies/public-validation-test-id')
  })

  it('keeps a logged-in user with companies on the results route and shows the own publications page', async () => {
    let entriesRequests = 0
    server.use(
      http.get('http://localhost:8080/api/ui/entries', ({ request }) => {
        entriesRequests++
        expect(new URL(request.url).searchParams.get('full')).toBe('false')
        return HttpResponse.json([], { status: 200 })
      })
    )
    await msalTester.isLogged()
    const router = await renderAt([company('2222222-2', 'B Oy'), company('1111111-1', 'A Oy')])

    expect(router.state.location.pathname).toBe('/data/results')
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(i18next.t('services:myData:header'))
    await waitFor(() => expect(entriesRequests).toBe(1))
  })

  it('waits with the load spinner while the companies of a logged-in user load', async () => {
    await msalTester.isLogged()
    const router = await renderAt(undefined)

    expect(router.state.location.pathname).toBe('/data/results')
    expect(document.querySelector('svg.spinner')).not.toBeNull()
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
  })

  it('replaces the history entry, so back does not return to the results route', async () => {
    await msalTester.isNotLogged()
    const router = await renderAt(undefined)
    expect(router.state.location.pathname).toBe('/data/companies/public-validation-test-id')

    await act(async () => {
      await router.navigate(-1)
    })

    expect(router.state.location.pathname).toBe('/data')
  })
})
