import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import i18next from 'i18next'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'
import VacoLandingNavbar from './VacoLandingNavbar'
import { myServicesItem } from './navbarItems'

const capturedItems = vi.hoisted(() => ({ items: [] as FdsNavigationItem[] }))

vi.mock('../Navbar', () => ({
  default: ({ items }: { items: FdsNavigationItem[] }) => {
    capturedItems.items = items
    return <nav />
  }
}))
vi.mock('../../EnvironmentBar/EnvironmentBar', () => ({ default: () => <div /> }))

describe('Services menu for a visitor', () => {
  beforeEach(() => {
    capturedItems.items = []
  })

  it('is named "Palvelut" in Finnish and lists data delivery and test data', async () => {
    await i18next.changeLanguage('fi')
    const item = myServicesItem(i18next.t)

    expect(item.label).toBe('Palvelut')
    expect(item.dropDownItems?.map((i) => i.value)).toEqual(['/data', '/data/request'])
  })

  it('is part of the landing navbar, which only visitors see', () => {
    render(<VacoLandingNavbar />)

    const services = capturedItems.items.find((i) => i.label === i18next.t('vaco:services'))
    expect(services).toBeDefined()
    expect(services?.dropDownItems?.map((i) => i.value)).toEqual(['/data', '/data/request'])
  })
})
