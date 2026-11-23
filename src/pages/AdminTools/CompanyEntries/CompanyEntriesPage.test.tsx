import { ReactNode, useRef } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { createMemoryRouter, MemoryRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import i18next from 'i18next'
import CompanyEntriesPage from './CompanyEntriesPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../../test/unit/vitestSetup'
import { server } from '../../../test/unit/mocks/server'
import { initializeBootstrap } from '../../../hooks/auth'
import { AppContext } from '../../../AppContextProvider'
import { Company } from '../../../types/Company'

interface DropdownProps {
  name: string
  label?: string
  options: { label: string; value: string }[]
}

// Emits the same bubbling CustomEvent('select') that the real fds-dropdown dispatches
vi.mock('../../../components/fds/FdsDropdownComponent', () => ({
  FdsDropdownComponent: ({ name, label, options }: DropdownProps): ReactNode => {
    const ref = useRef<HTMLDivElement | null>(null)
    return (
      <div ref={ref}>
        <select
          aria-label={label}
          value=""
          onChange={(e) =>
            ref.current?.dispatchEvent(
              new CustomEvent('select', { bubbles: true, detail: { name, value: e.currentTarget.value } })
            )
          }
        >
          <option value="" />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
}))

const company = (businessId: string, name: string): Company => ({ businessId, name, publish: false, roles: [] })

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

describe('Company Entries Page title and company dropdown', () => {
  let msalTester: MsalReactTester
  let router: ReturnType<typeof createMemoryRouter>

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    server.use(
      http.get('http://localhost:8080/api/ui/pages/company-entries/:businessId', () =>
        HttpResponse.json({ data: { entries: [] }, error: null, links: {} }, { status: 200 })
      )
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderAt = async (url: string, companies: Company[] | undefined) => {
    router = createMemoryRouter(
      [{ path: '/data/companies/:businessId', element: <CompanyEntriesPage /> }],
      { initialEntries: [url] }
    )
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
  }

  const title = () => screen.getByRole('heading', { level: 1 }).textContent

  const companyDropdown = () => screen.queryByLabelText(i18next.t('services:testData.form.company'))

  it('shows the test results title to a visitor on the public validation test company', async () => {
    await msalTester.isNotLogged()
    await renderAt('/data/companies/public-validation-test-id', undefined)

    expect(title()).toBe(i18next.t('vaco:testResults'))
  })

  it('shows the test results title to a logged-in user without a company', async () => {
    await msalTester.isLogged()
    await renderAt('/data/companies/public-validation-test-id', [])

    expect(title()).toBe(i18next.t('vaco:testResults'))
  })

  it('shows the name and business id on an own company without companyName in the URL', async () => {
    await msalTester.isLogged()
    await renderAt('/data/companies/1111111-1', [company('1111111-1', 'A Oy')])

    expect(title()).toBe('A Oy (1111111-1)')
  })

  it('keeps the title from the URL on a company that is not the own company', async () => {
    await msalTester.isLogged()
    await renderAt('/data/companies/3333333-3?companyName=Foreign%20Oy', [company('1111111-1', 'A Oy')])

    expect(title()).toBe('Foreign Oy (3333333-3)')
  })

  it('shows a dropdown for a user with two companies, and a selection opens the other company', async () => {
    await msalTester.isLogged()
    await renderAt('/data/companies/1111111-1', [company('1111111-1', 'A Oy'), company('2222222-2', 'B Oy')])

    const dropdown = companyDropdown()
    expect(dropdown).not.toBeNull()
    await act(async () => {
      fireEvent.change(dropdown as HTMLElement, { target: { value: '2222222-2' } })
    })

    await waitFor(() => expect(router.state.location.pathname).toBe('/data/companies/2222222-2'))
  })

  it('shows no dropdown for a visitor', async () => {
    await msalTester.isNotLogged()
    await renderAt('/data/companies/public-validation-test-id', undefined)

    expect(companyDropdown()).toBeNull()
  })

  it('shows no dropdown for a user with one company', async () => {
    await msalTester.isLogged()
    await renderAt('/data/companies/1111111-1', [company('1111111-1', 'A Oy')])

    expect(companyDropdown()).toBeNull()
  })

  it('shows no dropdown on a company that is not the own company', async () => {
    await msalTester.isLogged()
    await renderAt('/data/companies/3333333-3?companyName=Foreign%20Oy', [
      company('1111111-1', 'A Oy'),
      company('2222222-2', 'B Oy')
    ])

    expect(companyDropdown()).toBeNull()
  })
})
