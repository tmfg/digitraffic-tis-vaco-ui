import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import DataDeliveryPage from './DataDeliveryPage'
import { bootstrapParams } from '../../../test/unit/vitestSetup'
import { server } from '../../../test/unit/mocks/server'
import { initializeBootstrap } from '../../../hooks/auth'
import { AppContext } from '../../../AppContextProvider'

const tokenState = vi.hoisted(() => ({ value: [null, false] as [string | null, boolean] }))

vi.mock('../../../hooks/optionalAccessToken', () => ({
  useOptionalAccessToken: () => tokenState.value
}))
vi.mock(
  '../../../components/fds/FdsButtonComponent',
  async () => (await import('../../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)

describe('Data Delivery Page export', () => {
  let adminExportRequests: number
  let oldExportRequests: number

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    adminExportRequests = 0
    oldExportRequests = 0
    tokenState.value = [null, false]
    server.use(
      http.get('http://localhost:8080/api/ui/data-delivery', () => HttpResponse.json([], { status: 200 })),
      http.get('http://localhost:8080/api/ui/admin/data-delivery/export', () => {
        adminExportRequests++
        return HttpResponse.text('csv')
      }),
      http.get('http://localhost:8080/api/ui/data-delivery/export', () => {
        oldExportRequests++
        return HttpResponse.text('csv')
      })
    )
  })

  const renderPage = async (roles: string[] | undefined) => {
    await act(async () => {
      render(
        <AppContext.Provider value={{ companies: undefined, roles }}>
          <MemoryRouter>
            <DataDeliveryPage />
          </MemoryRouter>
        </AppContext.Provider>
      )
    })
  }

  it('shows no export button to a visitor', async () => {
    await renderPage(undefined)

    expect(screen.queryByRole('button', { name: 'Export CSV' })).toBeNull()
  })

  it('shows no export button to a signed-in user who is not an admin', async () => {
    tokenState.value = ['token', true]
    await renderPage(['vaco.company_admin'])

    expect(screen.queryByRole('button', { name: 'Export CSV' })).toBeNull()
  })

  it('disables the export button of an admin and sends nothing until the token is ready', async () => {
    await renderPage(['vaco.admin'])

    const button = screen.getByRole('button', { name: 'Export CSV' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(button)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
    })
    expect(adminExportRequests).toBe(0)
    expect(oldExportRequests).toBe(0)
  })

  it('exports from the admin path when an admin clicks the button', async () => {
    tokenState.value = ['token', true]
    await renderPage(['vaco.admin'])

    fireEvent.click(screen.getByRole('button', { name: 'Export CSV' }))

    await waitFor(() => expect(adminExportRequests).toBe(1))
    expect(oldExportRequests).toBe(0)
  })
})
