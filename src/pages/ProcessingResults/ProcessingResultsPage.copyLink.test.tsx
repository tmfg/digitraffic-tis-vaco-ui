import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MsalReactTester } from 'msal-react-tester'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'
import i18next from 'i18next'
import ProcessingResultsPage from './ProcessingResultsPage'
import { bootstrapParams, msalInitTester, resetTester } from '../../test/unit/vitestSetup'
import { server } from '../../test/unit/mocks/server'
import { initializeBootstrap } from '../../hooks/auth'

vi.mock(
  '../../components/fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)

const ENTRY_ID = 'copy-link-entry-id'

const entryState = {
  data: {
    entry: {
      data: {
        publicId: ENTRY_ID,
        name: 'Shared entry',
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

describe('Processing Results page copy link button', () => {
  let msalTester: MsalReactTester
  let writeText: ReturnType<typeof vi.fn>

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    msalTester = msalInitTester()
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    server.use(
      http.get('http://localhost:8080/api/ui/entries/' + ENTRY_ID + '/state', () => HttpResponse.json(entryState))
    )
  })

  afterEach(() => {
    resetTester(msalTester)
  })

  const renderPage = async () => {
    await msalTester.isNotLogged()
    await act(async () => {
      render(
        <MsalProvider instance={msalTester.client}>
          <MemoryRouter initialEntries={['/data/' + ENTRY_ID + '?magic=x']}>
            <Routes>
              <Route path="/data/:entryId" element={<ProcessingResultsPage />} />
            </Routes>
          </MemoryRouter>
        </MsalProvider>
      )
    })
    await screen.findByText('Shared entry')
  }

  const clickCopyLink = () =>
    fireEvent.click(screen.getByRole('button', { name: i18next.t('services:processingResults:copyLink') }))

  it('does not throw and shows no copied text when the clipboard is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    const logged = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await renderPage()

    expect(() => clickCopyLink()).not.toThrow()

    expect(screen.queryByText(i18next.t('common:copied'))).not.toBeInTheDocument()
    expect(logged).toHaveBeenCalled()
    logged.mockRestore()
  })

  it('keeps the copied text for 3 seconds after the latest click', async () => {
    await renderPage()
    vi.useFakeTimers({ shouldAdvanceTime: false, toFake: ['setTimeout', 'clearTimeout'] })
    try {
      clickCopyLink()
      await act(async () => {
        await Promise.resolve()
      })
      expect(screen.getByText(i18next.t('common:copied'))).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(2000)
      })
      clickCopyLink()
      await act(async () => {
        await Promise.resolve()
      })
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(screen.getByText(i18next.t('common:copied'))).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows a visitor the button, copies the link without the query string and confirms it', async () => {
    await renderPage()
    clickCopyLink()

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText).toHaveBeenCalledWith(window.location.origin + window.location.pathname)
    expect(await screen.findByText(i18next.t('common:copied'))).toBeInTheDocument()
  })
})
