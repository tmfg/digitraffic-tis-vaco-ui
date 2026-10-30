import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import i18next from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../test/unit/mocks/server'
import { Company } from '../../types/Company'
import DeleteCompanyModal from './DeleteCompanyModal'

const msal = { instance: {}, inProgress: 'none' }
vi.mock('@azure/msal-react', () => ({ useMsal: () => msal }))
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

const renderModal = (references: Record<string, number>) => {
  server.use(http.get(`${COMPANY_URL}/references`, () => HttpResponse.json({ data: references })))
  return render(<DeleteCompanyModal close={close} company={company} onDeleted={onDeleted} />)
}

const close = vi.fn()
const onDeleted = vi.fn()

const findDeleteButton = () => screen.findByRole('button', { name: i18next.t('admin:company:delete:action') })

const confirmDelete = async () => fireEvent.click(await findDeleteButton())

const querySpinner = (container: HTMLElement) => container.querySelector('svg.spinner')

// A delete request that stays pending until release() is called, then succeeds
const holdDeleteRequest = () => {
  let release = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  let requestCount = 0
  server.use(
    http.delete(COMPANY_URL, async () => {
      requestCount++
      await gate
      return new HttpResponse(null, { status: 204 })
    })
  )
  return { release, requestCount: () => requestCount }
}

describe('DeleteCompanyModal', () => {
  beforeEach(() => {
    close.mockReset()
    onDeleted.mockReset()
  })

  it('names the company in the confirmation text', async () => {
    renderModal({})

    expect(screen.getByText(/Test company/)).toBeInTheDocument()
    await findDeleteButton()
  })

  it('warns about the linked data that the delete removes', async () => {
    renderModal({ entries: 3, feeds: 1 })

    expect(await screen.findByText(i18next.t('admin:company:delete:linkedWarning'))).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows no warning when the company has no linked data', async () => {
    renderModal({})

    await findDeleteButton()
    expect(screen.queryByText(i18next.t('admin:company:delete:linkedWarning'))).not.toBeInTheDocument()
  })

  it('offers the delete only after the linked data is loaded', async () => {
    renderModal({ entries: 3 })

    expect(screen.queryByRole('button', { name: i18next.t('admin:company:delete:action') })).not.toBeInTheDocument()
    expect(await findDeleteButton()).toBeInTheDocument()
  })

  it('reports the deletion when the backend accepts it', async () => {
    renderModal({ entries: 3 })
    server.use(http.delete(COMPANY_URL, () => new HttpResponse(null, { status: 204 })))

    await confirmDelete()

    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
  })

  it.each([
    ['IN_PROGRESS', 'admin:company:delete:inProgress'],
    ['PROTECTED', 'admin:company:delete:protected']
  ])('shows the reason when the backend refuses with %s', async (reason, messageKey) => {
    renderModal({})
    server.use(http.delete(COMPANY_URL, () => HttpResponse.json({ data: reason }, { status: 409 })))

    await confirmDelete()

    expect(await screen.findByText(i18next.t(messageKey))).toBeInTheDocument()
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('shows the error message for any other failure', async () => {
    renderModal({})
    server.use(http.delete(COMPANY_URL, () => HttpResponse.json({}, { status: 500 })))

    await confirmDelete()

    expect(await screen.findByRole('alert')).toHaveTextContent('500')
    expect(onDeleted).not.toHaveBeenCalled()
  })

  it('shows the error message when the linked data cannot be loaded', async () => {
    server.use(http.get(`${COMPANY_URL}/references`, () => HttpResponse.json({}, { status: 500 })))
    render(<DeleteCompanyModal close={close} company={company} onDeleted={onDeleted} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('500')
    expect(screen.queryByRole('button', { name: i18next.t('admin:company:delete:action') })).not.toBeInTheDocument()
  })

  it('shows no spinner before the delete is confirmed', async () => {
    const { container } = renderModal({ entries: 3 })

    expect(await findDeleteButton()).not.toHaveAttribute('aria-disabled')
    expect(querySpinner(container)).not.toBeInTheDocument()
  })

  it('shows a spinner and disables the delete button while the request is pending', async () => {
    const { container } = renderModal({})
    const request = holdDeleteRequest()

    await confirmDelete()

    await waitFor(() => expect(querySpinner(container)).toBeInTheDocument())
    expect(await findDeleteButton()).toHaveAttribute('aria-disabled', 'true')
    request.release()
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
  })

  it('does not send a second request when delete is clicked again while pending', async () => {
    renderModal({})
    const request = holdDeleteRequest()
    const deleteButton = await findDeleteButton()

    fireEvent.click(deleteButton)
    await waitFor(() => expect(request.requestCount()).toBe(1))
    fireEvent.click(deleteButton)
    request.release()

    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
    expect(request.requestCount()).toBe(1)
  })

  it('sends one request when delete is clicked twice before the component re-renders', async () => {
    renderModal({})
    const request = holdDeleteRequest()
    const deleteButton = await findDeleteButton()

    act(() => {
      fireEvent.click(deleteButton)
      fireEvent.click(deleteButton)
    })
    request.release()

    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
    expect(request.requestCount()).toBe(1)
  })

  it.each([
    ['cancel', () => screen.getByRole('button', { name: i18next.t('common:cancel') })],
    ['close', () => screen.getByRole('button', { name: 'x' })]
  ])('ignores %s while the request is pending', async (_, getButton) => {
    const { container } = renderModal({})
    const request = holdDeleteRequest()
    await confirmDelete()
    await waitFor(() => expect(querySpinner(container)).toBeInTheDocument())

    fireEvent.click(getButton())

    expect(close).not.toHaveBeenCalled()
    request.release()
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
  })

  it.each([
    ['a 409 refusal', 409, { data: 'PROTECTED' }, 'admin:company:delete:protected'],
    ['another error', 500, {}, '500']
  ])('stops the spinner and allows a retry after %s', async (_, status, body, expectedText) => {
    const { container } = renderModal({})
    server.use(http.delete(COMPANY_URL, () => HttpResponse.json(body, { status })))

    await confirmDelete()

    expect(await screen.findByRole('alert')).toHaveTextContent(i18next.t(expectedText))
    expect(querySpinner(container)).not.toBeInTheDocument()
    expect(await findDeleteButton()).not.toHaveAttribute('aria-disabled')

    fireEvent.click(screen.getByRole('button', { name: i18next.t('common:cancel') }))
    expect(close).toHaveBeenCalledOnce()

    let retried = false
    server.use(
      http.delete(COMPANY_URL, () => {
        retried = true
        return new HttpResponse(null, { status: 204 })
      })
    )
    await confirmDelete()
    await waitFor(() => expect(onDeleted).toHaveBeenCalledOnce())
    expect(retried).toBe(true)
  })

  it('closes when the user cancels', async () => {
    renderModal({})
    await findDeleteButton()

    fireEvent.click(screen.getByRole('button', { name: i18next.t('common:cancel') }))

    expect(close).toHaveBeenCalledOnce()
  })
})
