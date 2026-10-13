import { fireEvent, render, screen } from '@testing-library/react'
import i18next from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Company } from '../../types/Company'
import AddCompany from './AddCompany'

const navigate = vi.fn()
const createdCompany: Company = { businessId: '2942108-7', name: 'New company', publish: true, roles: [] }

vi.mock('react-router-dom', () => ({ useNavigate: () => navigate }))
vi.mock(
  '../fds/FdsButtonComponent',
  async () => (await import('../../test/unit/mocks/fdsComponents')).fdsComponentMocks.button
)
vi.mock('./AddCompanyModal', () => ({
  default: ({ close, onCreated }: { close: () => void; onCreated: (company: Company) => void }) => (
    <div>
      <button onClick={close}>close modal</button>
      <button onClick={() => onCreated(createdCompany)}>create company</button>
    </div>
  )
}))

describe('AddCompany', () => {
  beforeEach(() => {
    navigate.mockReset()
    render(<AddCompany />)
  })

  const openModal = () => fireEvent.click(screen.getByRole('button', { name: i18next.t('admin:companies:add:button') }))

  it('shows the modal only after the button is clicked', () => {
    expect(screen.queryByText('create company')).not.toBeInTheDocument()

    openModal()

    expect(screen.getByText('create company')).toBeInTheDocument()
  })

  it('hides the modal when it closes', () => {
    openModal()

    fireEvent.click(screen.getByText('close modal'))

    expect(screen.queryByText('create company')).not.toBeInTheDocument()
  })

  it('opens the info page of the created company', () => {
    openModal()

    fireEvent.click(screen.getByText('create company'))

    expect(navigate).toHaveBeenCalledWith('/admin/companies/2942108-7/info')
  })
})
