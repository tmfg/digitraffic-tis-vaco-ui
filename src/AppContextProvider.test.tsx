import { act, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { useContext } from 'react'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import AppContextProvider, { AppContext } from './AppContextProvider'
import { bootstrapParams, msalInitTester, resetTester } from './test/unit/vitestSetup'
import { server } from './test/unit/mocks/server'
import { initializeBootstrap } from './hooks/auth'

const CompaniesProbe = () => {
  const { companies } = useContext(AppContext)
  return <div data-testid="companies">{companies === undefined ? 'undefined' : JSON.stringify(companies)}</div>
}

describe('AppContextProvider companies', () => {
  let msalTester: MsalReactTester
  let meRequests: number

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    meRequests = 0
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderProvider = async () => {
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <AppContextProvider>
            <CompaniesProbe />
          </AppContextProvider>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
  }

  it('sets companies to an empty list when /api/me fails', async () => {
    server.use(
      http.get('http://localhost:8080/api/me', () => {
        meRequests++
        return HttpResponse.json({ error: 'boom' }, { status: 500 })
      })
    )
    await msalTester.isLogged()
    await renderProvider()

    await waitFor(() => expect(screen.getByTestId('companies')).toHaveTextContent('[]'))
    expect(meRequests).toBe(1)
  })

  it('sets companies from /api/me when it succeeds', async () => {
    await msalTester.isLogged()
    await renderProvider()

    await waitFor(() => expect(screen.getByTestId('companies')).toHaveTextContent('Fintraffic Oy'))
  })
})
