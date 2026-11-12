import { fireEvent, render, screen } from '@testing-library/react'
import i18next from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Company } from '../../types/Company'
import DeleteCompany from './DeleteCompany'

const navigate = vi.fn()
const company: Company = { businessId: '2499374-6', name: 'Test company', publish: true, roles: [] }

vi.mock('react-router-dom', () => ({ useNavigate: () => navigate }))
vi.mock(
  '../fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)
vi.mock('./DeleteCompanyModal', () => ({
  default: ({ company, close, onDeleted }: { company: Company; close: () => void; onDeleted: () => void }) => (
    <div>
      <span>deleting {company.name}</span>
      <button onClick={close}>close modal</button>
      <button onClick={onDeleted}>confirm delete</button>
    </div>
  )
}))

describe('DeleteCompany', () => {
  beforeEach(() => {
    navigate.mockReset()
    render(<DeleteCompany company={company} />)
  })

  const openModal = () =>
    fireEvent.click(screen.getByRole('button', { name: i18next.t('admin:company:delete:button') }))

  it('shows the modal for the company only after the button is clicked', () => {
    expect(screen.queryByText('deleting Test company')).not.toBeInTheDocument()

    openModal()

    expect(screen.getByText('deleting Test company')).toBeInTheDocument()
  })

  it('hides the modal when it closes', () => {
    openModal()

    fireEvent.click(screen.getByText('close modal'))

    expect(screen.queryByText('deleting Test company')).not.toBeInTheDocument()
  })

  it('opens the company list after the deletion', () => {
    openModal()

    fireEvent.click(screen.getByText('confirm delete'))

    expect(navigate).toHaveBeenCalledWith('/admin/companies')
  })
})
