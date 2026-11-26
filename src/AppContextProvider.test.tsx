import { act, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { useContext } from 'react'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import AppContextProvider, { AppContext } from './AppContextProvider'
import { bootstrapParams, msalInitTester, resetTester } from './test/unit/vitestSetup'
import { server } from './test/unit/mocks/server'
import { initializeBootstrap } from './hooks/auth'

// A token whose payload part is an empty JSON object, so that the role parsing succeeds
const FIRST_TOKEN = 'a.e30.first'
const tokenState = vi.hoisted(() => ({ token: null as string | null }))

// Uses the real token unless a test sets one, which lets a test change the token mid-request
vi.mock('./hooks/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./hooks/auth')>()
  return {
    ...actual,
    useAcquireToken: () => {
      const real = actual.useAcquireToken()
      return tokenState.token ? ([tokenState.token] as const) : real
    }
  }
})

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
    tokenState.token = null
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

  it('ignores a failure of a request that a token change made stale', async () => {
    let tokenRequests = 0
    let failFirst: () => void = () => undefined
    server.use(
      http.get('http://localhost:8080/api/me', async ({ request }) => {
        tokenRequests++
        if (request.headers.get('Authorization') === 'Bearer ' + FIRST_TOKEN) {
          await new Promise<void>((resolve) => {
            failFirst = resolve
          })
          return HttpResponse.json({ error: 'boom' }, { status: 500 })
        }
        return HttpResponse.json({
          data: { companies: [{ businessId: '1111111-1', name: 'Second Token Oy', publish: false, roles: [] }] }
        })
      })
    )
    await msalTester.isLogged()
    // A new element on every call, so that a rerender is not skipped
    const view = () => (
      <MsalProvider instance={msalTester.client}>
        <AppContextProvider>
          <CompaniesProbe />
        </AppContextProvider>
      </MsalProvider>
    )
    tokenState.token = FIRST_TOKEN
    let rendered: ReturnType<typeof render> | undefined
    await act(async () => {
      rendered = render(view())
    })
    await waitFor(() => expect(tokenRequests).toBe(1))

    tokenState.token = 'a.e30.second'
    await act(async () => {
      rendered?.rerender(view())
    })
    await waitFor(() => expect(screen.getByTestId('companies')).toHaveTextContent('Second Token Oy'))

    await act(async () => {
      failFirst()
    })
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByTestId('companies')).toHaveTextContent('Second Token Oy')
  })

  it('sets companies from /api/me when it succeeds', async () => {
    await msalTester.isLogged()
    await renderProvider()

    await waitFor(() => expect(screen.getByTestId('companies')).toHaveTextContent('Fintraffic Oy'))
  })
})
