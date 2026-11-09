import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import i18next from 'i18next'
import ProcessingResultsPage from './ProcessingResultsPage'
import { AppContext } from '../../AppContextProvider'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'

vi.mock('../../hooks/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../hooks/auth')>()),
  useAcquireToken: () => ['test-token']
}))
vi.mock('../../components/ProcessingResults/hooks', () => ({
  useProcessingResultsPageState: () => [undefined]
}))
vi.mock('../../components/TestData/hooks.ts', () => ({
  useUserEmail: () => ['user@example.fi']
}))
vi.mock('../../components/TestData/SubmissionModal/SubmissionModal.tsx', () => ({
  default: () => <div>submission modal</div>
}))
vi.mock(
  '../../components/fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)

const ENTRY_ID = 'rerun-entry-id'
const STATE_URL = 'http://localhost:8080/api/ui/entries/' + ENTRY_ID + '/state'
const RERUN_URL = 'http://localhost:8080/api/ui/admin/entries/' + ENTRY_ID + '/rerun'

const entryState = {
  data: {
    entry: {
      data: {
        publicId: ENTRY_ID,
        name: 'Rerun candidate',
        format: 'gtfs',
        url: 'https://test.fi/473/all.zip',
        tasks: [],
        validations: [{ name: 'gtfs.canonical' }],
        conversions: [],
        created: '2024-01-28T22:16:41.73',
        completed: '2024-01-28T22:17:43.762'
      },
      links: {}
    },
    summaries: [],
    reports: [],
    company: 'Some Other Oy'
  },
  error: null,
  links: {}
}

describe('Processing Results page rerun button', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    server.use(http.get(STATE_URL, () => HttpResponse.json(entryState)))
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderPage = async (roles: string[]) => {
    await msalTester.isLogged()
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          {/* The user belongs to no company, so only the role can allow the rerun. */}
          <AppContext.Provider value={{ companies: [], roles }}>
            <MemoryRouter initialEntries={['/data/' + ENTRY_ID]}>
              <Routes>
                <Route path="/data/:entryId" element={<ProcessingResultsPage />} />
              </Routes>
            </MemoryRouter>
          </AppContext.Provider>
        </MsalProvider>
      )
    })
    await screen.findByText('Rerun candidate')
  }

  const rerunButtonName = () => i18next.t('services:processingResults.rerun')

  it('shows the rerun button to an admin who is not a member of the entry company', async () => {
    await renderPage(['vaco.admin'])

    expect(screen.getByRole('button', { name: rerunButtonName() })).toBeInTheDocument()
  })

  it('hides the rerun button from a user without the admin role', async () => {
    await renderPage(['vaco.company_admin'])

    expect(screen.queryByRole('button', { name: rerunButtonName() })).toBeNull()
  })

  it('posts only the entry id to the admin rerun endpoint when the button is clicked', async () => {
    const requests: { body: string; contentLength: string | null }[] = []
    server.use(
      http.post(RERUN_URL, async ({ request }) => {
        requests.push({ body: await request.text(), contentLength: request.headers.get('content-length') })
        return HttpResponse.json({ data: { publicId: 'new-entry-id', sendNotifications: false }, links: {} })
      })
    )
    await renderPage(['vaco.admin'])

    fireEvent.click(screen.getByRole('button', { name: rerunButtonName() }))

    await waitFor(() => expect(requests).toHaveLength(1))
    expect(requests[0].body).toBe('')
  })
})
