import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ShortcutCard from './ShortcutCard'
import { Shortcut } from './types'
import { MemoryRouter } from 'react-router-dom'
import i18next from 'i18next'

describe('ShortcutCard component tests', () => {
  it('Renders Shortcut', () => {
    const item: Shortcut = {
      label: 'Label',
      to: '/',
      description: 'Description'
    }
    render(
      <MemoryRouter>
        <ShortcutCard item={item} />
      </MemoryRouter>
    )
    const label: HTMLElement = screen.getByText(item.label)
    expect(label).toBeInTheDocument()
    const description: HTMLElement = screen.getByText(item.description)
    expect(description).toBeInTheDocument()
    const navigateText: string = i18next.t('home:shortcut:navigate').toUpperCase()
    const navigate: HTMLElement = screen.getByText(navigateText)
    expect(navigate).toBeInTheDocument()
  })
})
