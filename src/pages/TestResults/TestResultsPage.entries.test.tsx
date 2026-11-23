import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MsalProvider } from '@azure/msal-react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import i18next from 'i18next'
import { appChildRoutes } from '../../App'
import { AppContext } from '../../AppContextProvider'
import { EnvironmentContext } from '../../EnvironmentProvider'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'

vi.mock(
  '../../components/fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)
vi.mock(
  '../../components/fds/FdsInputComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.input
)

const entry = (index: number, overrides: Record<string, unknown> = {}) => ({
  data: {
    publicId: 'entry-id-' + String(index).padStart(2, '0'),
    name: 'Feed ' + String(index).padStart(2, '0'),
    format: 'gtfs',
    context: null,
    status: index % 2 === 0 ? 'success' : 'errors',
    created: '2026-01-' + String(index).padStart(2, '0') + 'T10:00:00Z',
    started: null,
    completed: null,
    ...overrides
  },
  links: {}
})

describe('Test results page for a logged-in user with companies', () => {
  let msalTester: MsalReactTester

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderWith = async (entries: unknown[]) => {
    server.use(http.get('http://localhost:8080/api/ui/entries', () => HttpResponse.json(entries, { status: 200 })))
    await msalTester.isLogged()
    const router = createMemoryRouter(appChildRoutes, { initialEntries: ['/data/results'] })
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <EnvironmentContext.Provider value={bootstrapParams}>
            <AppContext.Provider
              value={{
                companies: [{ businessId: '1111111-1', name: 'A Oy', publish: false, roles: [] }],
                roles: undefined
              }}
            >
              <RouterProvider router={router} />
            </AppContext.Provider>
          </EnvironmentContext.Provider>
        </MsalProvider>
      )
    })
    await msalTester.waitForRedirect()
  }

  const bodyRows = () => Array.from(document.querySelectorAll('tbody tr'))
  const firstCells = () => bodyRows().map((row) => row.querySelector('td')?.textContent)

  const search = async (word: string) => {
    await act(async () => {
      fireEvent.input(screen.getByLabelText(i18next.t('services:myData:searchWord')), { target: { value: word } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: i18next.t('common:search') }))
    })
  }

  it('shows the headings, the intro, the column headers and one row per entry, newest first', async () => {
    await renderWith([entry(1), entry(3), entry(2)])

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(i18next.t('services:myData:header'))
    expect(screen.getByText(i18next.t('services:myData:intro').trim())).toBeInTheDocument()
    expect(screen.getByText(i18next.t('services:myData:find'))).toBeInTheDocument()
    expect(screen.getByText(i18next.t('services:myData:latest'))).toBeInTheDocument()
    await waitFor(() => expect(bodyRows()).toHaveLength(3))
    expect(firstCells()).toEqual(['entry-id-03', 'entry-id-02', 'entry-id-01'])
    for (const key of ['id', 'context', 'feedName', 'format', 'dateCreated', 'dateStarted', 'dateCompleted', 'status']) {
      expect(screen.getByText(i18next.t('services:myData.table.' + key))).toBeInTheDocument()
    }
  })

  it('shows a status badge on each row', async () => {
    await renderWith([entry(1), entry(2)])

    await waitFor(() => expect(bodyRows()).toHaveLength(2))
    const badges = document.querySelectorAll('tbody img[alt="badge"]')
    expect(badges).toHaveLength(2)
    expect(badges[0].getAttribute('src')).toContain('/api/badge/entry-id-02')
  })

  it('filters the rows by entry id and by name', async () => {
    await renderWith([entry(1), entry(2), entry(3, { name: 'Special feed' })])
    await waitFor(() => expect(bodyRows()).toHaveLength(3))

    await search('entry-id-02')
    expect(firstCells()).toEqual(['entry-id-02'])

    await search('special')
    expect(firstCells()).toEqual(['entry-id-03'])
  })

  it('sorts the rows by the feed name column', async () => {
    await renderWith([entry(2), entry(1), entry(3)])
    await waitFor(() => expect(bodyRows()).toHaveLength(3))

    await act(async () => {
      fireEvent.click(document.querySelector('[id="myData-sortBy-feedName"] a') as HTMLElement)
    })
    await act(async () => {
      fireEvent.click(screen.getByText(i18next.t('sorting:sort:asc')))
    })

    expect(firstCells()).toEqual(['entry-id-01', 'entry-id-02', 'entry-id-03'])
  })

  it('shows 25 rows on page 1 when there are 26 entries', async () => {
    const entries = Array.from({ length: 26 }, (_, i) => entry(i + 1))
    await renderWith(entries)

    await waitFor(() => expect(bodyRows()).toHaveLength(25))
    expect(firstCells()[0]).toBe('entry-id-26')

    await act(async () => {
      fireEvent.click(screen.getByText('2'))
    })
    expect(bodyRows()).toHaveLength(1)
  })

  it('shows the no data message when there are no entries', async () => {
    await renderWith([])

    await waitFor(() => expect(screen.getByText(i18next.t('services:myData:noDataFound'))).toBeInTheDocument())
  })
})
