import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LinkedDataList from './LinkedDataList'

describe('LinkedDataList', () => {
  it('shows every linked data kind with its count', () => {
    render(<LinkedDataList references={{ entries: 3, feeds: 1 }} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText(/: 3$/)).toBeInTheDocument()
    expect(screen.getByText(/: 1$/)).toBeInTheDocument()
  })
})
