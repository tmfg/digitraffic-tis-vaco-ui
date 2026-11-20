import { ReactNode, useRef } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import i18next from 'i18next'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'
import { AppContext } from '../../AppContextProvider'
import { Company } from '../../types/Company'
import { PublicValidationTest } from '../../types/PublicValidationTest'
import Form from './Form'

interface DropdownProps {
  name: string
  label?: string
  options: { label: string; value: string }[]
}

// Emits the same bubbling CustomEvent('select') that the real fds-dropdown dispatches
vi.mock('../fds/FdsDropdownComponent', () => ({
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

vi.mock(
  '../fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)

const company = (businessId: string, name: string): Company => ({
  businessId,
  name,
  publish: false,
  roles: []
})

describe('Test Data Form company choice', () => {
  let msalTester: MsalReactTester
  let rulesRequests: (string | null)[]

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    rulesRequests = []
    server.use(
      http.get('http://localhost:8080/api/ui/rules', ({ request }) => {
        rulesRequests.push(new URL(request.url).searchParams.get('businessId'))
        return HttpResponse.json([], { status: 200 })
      })
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderForm = async (companies: Company[] | undefined) => {
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <AppContext.Provider value={{ companies, roles: undefined }}>
            <MemoryRouter>
              <Form />
            </MemoryRouter>
          </AppContext.Provider>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
  }

  const companyLabel = () => i18next.t('services:testData.form.company') + ' *'

  it('shows a company dropdown with every own company to a logged-in user', async () => {
    await msalTester.isLogged()
    await renderForm([company('1111111-1', 'First Oy'), company('2222222-2', 'Second Oy')])

    const dropdown = screen.getByLabelText(companyLabel())
    expect(Array.from(dropdown.querySelectorAll('option')).map((o) => o.getAttribute('value'))).toEqual([
      '',
      '1111111-1',
      '2222222-2'
    ])
  })

  it('loads the rules of the selected company and follows a change of the selection', async () => {
    await msalTester.isLogged()
    await renderForm([company('1111111-1', 'First Oy'), company('2222222-2', 'Second Oy')])

    fireEvent.change(screen.getByLabelText(companyLabel()), { target: { value: '1111111-1' } })
    await waitFor(() => expect(rulesRequests).toContain('1111111-1'))

    fireEvent.change(screen.getByLabelText(companyLabel()), { target: { value: '2222222-2' } })
    await waitFor(() => expect(rulesRequests).toContain('2222222-2'))
    expect(rulesRequests).not.toContain(PublicValidationTest.businessId)
  })

  it('keeps submit disabled until the rules of a newly selected company have loaded', async () => {
    let releaseSecond: () => void = () => undefined
    server.use(
      http.get('http://localhost:8080/api/ui/rules', async ({ request }) => {
        if (new URL(request.url).searchParams.get('businessId') === '2222222-2') {
          await new Promise<void>((resolve) => {
            releaseSecond = resolve
          })
        }
        return HttpResponse.json([], { status: 200 })
      })
    )
    await msalTester.isLogged()
    await renderForm([company('1111111-1', 'First Oy'), company('2222222-2', 'Second Oy')])
    const submit = () => screen.getByRole('button', { name: i18next.t('services:testData:form:submit') })

    fireEvent.change(screen.getByLabelText(companyLabel()), { target: { value: '1111111-1' } })
    await waitFor(() => expect(submit()).not.toHaveAttribute('aria-disabled', 'true'))

    fireEvent.change(screen.getByLabelText(companyLabel()), { target: { value: '2222222-2' } })
    await waitFor(() => expect(submit()).toHaveAttribute('aria-disabled', 'true'))

    await act(async () => releaseSecond())
    await waitFor(() => expect(submit()).not.toHaveAttribute('aria-disabled', 'true'))
  })

  it('preselects the only company of a logged-in user', async () => {
    await msalTester.isLogged()
    await renderForm([company('1111111-1', 'Only Oy')])

    await waitFor(() => expect(rulesRequests).toEqual(['1111111-1']))
  })

  it('shows no company dropdown to a visitor and loads the rules of the public test company', async () => {
    await msalTester.isNotLogged()
    await renderForm(undefined)

    expect(screen.queryByLabelText(companyLabel())).toBeNull()
    await waitFor(() => expect(rulesRequests).toEqual([PublicValidationTest.businessId]))
  })
})
