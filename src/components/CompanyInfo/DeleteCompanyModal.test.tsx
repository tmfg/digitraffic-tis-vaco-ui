import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import i18next from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../test/unit/mocks/server'
import { Company } from '../../types/Company'
import DeleteCompanyModal from './DeleteCompanyModal'

vi.mock('@azure/msal-react', () => ({ useMsal: () => ({ instance: {}, inProgress: 'none' }) }))
vi.mock('../../hooks/auth', () => ({ acquireToken: () => Promise.resolve({ accessToken: 'token' }) }))
vi.mock(
  '../fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)
vi.mock(
  '../fds/FdsAlertComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.alert
)
vi.mock(
  '../fds/FdsCardComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.card
)
vi.mock(
  '../fds/FdsDialogComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.dialog
)
vi.mock(
  '../fds/FdsActionSheetComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.actionSheet
)

const COMPANY_URL = 'http://localhost:8080/api/ui/admin/companies/2499374-6'
const company: Company = { businessId: '2499374-6', name: 'Test company', publish: true, roles: [] }

describe('DeleteCompanyModal', () => {
  const close = vi.fn()
  const onDeleted = vi.fn()

  beforeEach(() => {
    close.mockReset()
    onDeleted.mockReset()
    render(<DeleteCompanyModal close={close} company={company} onDeleted={onDeleted} />)
  })

  const confirmDelete = () =>
    fireEvent.click(screen.getByRole('button', { name: i18next.t('admin:company:delete:action') }))

  it('names the company in the confirmation text', () => {
    expect(screen.getByText(/Test company/)).toBeInTheDocument()
  })

  it('reports the deletion when the backend accepts it', async () => {
    server.use(http.delete(COMPANY_URL, () => new HttpResponse(null, { status: 204 })))

    confirmDelete()

    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
  })

  it('lists the linked data when the backend refuses the deletion', async () => {
    server.use(http.delete(COMPANY_URL, () => HttpResponse.json({ data: { entries: 3, feeds: 1 } }, { status: 409 })))

    confirmDelete()

    expect(await screen.findByText(i18next.t('admin:company:delete:refused'))).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('shows the protected message when the refusal lists no linked data', async () => {
    server.use(http.delete(COMPANY_URL, () => HttpResponse.json({ data: null }, { status: 409 })))

    confirmDelete()

    expect(await screen.findByText(i18next.t('admin:company:delete:protected'))).toBeInTheDocument()
  })

  it('shows the error message for any other failure', async () => {
    server.use(http.delete(COMPANY_URL, () => HttpResponse.json({}, { status: 500 })))

    confirmDelete()

    expect(await screen.findByRole('alert')).toHaveTextContent('500')
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('closes when the user cancels', () => {
    fireEvent.click(screen.getByRole('button', { name: i18next.t('common:cancel') }))

    expect(close).toHaveBeenCalledOnce()
  })
})
