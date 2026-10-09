import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import i18next from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../test/unit/mocks/server'
import AddCompanyModal from './AddCompanyModal'

vi.mock('@azure/msal-react', () => ({ useMsal: () => ({ instance: {}, inProgress: 'none' }) }))
vi.mock('../../hooks/auth', () => ({ acquireToken: () => Promise.resolve({ accessToken: 'token' }) }))
vi.mock(
  '../fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)
vi.mock(
  '../fds/FdsInputComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.input
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

const COMPANIES_URL = 'http://localhost:8080/api/ui/admin/companies'
const t = (key: string, options?: Record<string, string>) => i18next.t(key, options)

describe('AddCompanyModal', () => {
  const close = vi.fn()
  const onCreated = vi.fn()

  beforeEach(() => {
    close.mockReset()
    onCreated.mockReset()
    render(<AddCompanyModal close={close} onCreated={onCreated} />)
  })

  const fill = (name: string, businessId: string) => {
    fireEvent.input(screen.getByLabelText(t('admin:company:name')), { target: { value: name } })
    fireEvent.input(screen.getByLabelText(t('admin:company:businessId')), { target: { value: businessId } })
  }

  const save = () => fireEvent.click(screen.getByRole('button', { name: t('common:save') }))

  it('shows both validation messages and sends nothing when the form is empty', () => {
    let requested = false
    server.use(
      http.post(COMPANIES_URL, () => {
        requested = true
        return HttpResponse.json({})
      })
    )

    save()

    expect(screen.getByText(t('formValidation:isRequired', { value: t('admin:company:name') }))).toBeInTheDocument()
    expect(screen.getByText(t('admin:companies:add:invalidBusinessId'))).toBeInTheDocument()
    expect(requested).toBe(false)
  })

  it('rejects a business ID with a wrong check digit', () => {
    fill('Test company', '2499374-9')

    save()

    expect(screen.getByText(t('admin:companies:add:invalidBusinessId'))).toBeInTheDocument()
  })

  it('clears the business ID message when the user edits the field', () => {
    save()
    expect(screen.getByText(t('admin:companies:add:invalidBusinessId'))).toBeInTheDocument()

    fill('Test company', '2499374')

    expect(screen.queryByText(t('admin:companies:add:invalidBusinessId'))).not.toBeInTheDocument()
  })

  it('posts the trimmed values and reports the created company', async () => {
    let body: unknown
    server.use(
      http.post(COMPANIES_URL, async ({ request }) => {
        body = await request.json()
        return HttpResponse.json({ data: { businessId: '2942108-7', name: 'Test company' } }, { status: 201 })
      })
    )
    fill('  Test company ', ' 2942108-7 ')

    save()

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith({ businessId: '2942108-7', name: 'Test company' }))
    expect(body).toEqual({ businessId: '2942108-7', name: 'Test company', publish: true, roles: [] })
  })

  it('shows the duplicate message when the business ID already exists', async () => {
    server.use(http.post(COMPANIES_URL, () => HttpResponse.json({}, { status: 409 })))
    fill('Test company', '2942108-7')

    save()

    expect(await screen.findByText(t('formValidation:exists'))).toBeInTheDocument()
    expect(onCreated).not.toHaveBeenCalled()
  })

  it('shows the business ID message when the backend rejects the ID', async () => {
    server.use(http.post(COMPANIES_URL, () => HttpResponse.json({}, { status: 400 })))
    fill('Test company', '2942108-7')

    save()

    expect(await screen.findByText(t('admin:companies:add:invalidBusinessId'))).toBeInTheDocument()
  })

  it('closes when the user cancels', () => {
    fireEvent.click(screen.getByRole('button', { name: t('common:cancel') }))

    expect(close).toHaveBeenCalledOnce()
  })
})
