import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import DataDeliveryPage from './DataDeliveryPage'
import { bootstrapParams } from '../../../test/unit/vitestSetup'
import { server } from '../../../test/unit/mocks/server'
import { initializeBootstrap } from '../../../hooks/auth'

// The token is not ready yet, as it is while an admin signs in
vi.mock('../../../hooks/optionalAccessToken', () => ({
  useOptionalAccessToken: () => [null, false]
}))
vi.mock(
  '../../../components/fds/FdsButtonComponent',
  async () => (await import('../../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)

describe('Data Delivery Page export', () => {
  let exportRequests: number

  beforeEach(() => {
    initializeBootstrap(bootstrapParams)
    exportRequests = 0
    server.use(
      http.get('http://localhost:8080/api/ui/data-delivery/export', () => {
        exportRequests++
        return HttpResponse.text('csv')
      })
    )
  })

  it('disables the export button and sends nothing until the token is ready', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <DataDeliveryPage />
        </MemoryRouter>
      )
    })

    const button = screen.getByRole('button', { name: 'Export CSV' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(button)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
    })
    expect(exportRequests).toBe(0)
  })
})
