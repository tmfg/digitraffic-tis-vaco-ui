import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import i18next from 'i18next'
import { FdsNavigationItem } from '../../../../coreui-components/src/fds-navigation'
import VacoAuthenticatedNavbar from './VacoAuthenticatedNavbar'
import { myServicesItem } from './navbarItems'

const capturedItems = vi.hoisted(() => ({ items: [] as FdsNavigationItem[] }))

vi.mock('../Navbar', () => ({
  default: ({ items }: { items: FdsNavigationItem[] }) => {
    capturedItems.items = items
    return <nav />
  }
}))
vi.mock('../../EnvironmentBar/EnvironmentBar', () => ({ default: () => <div /> }))
const msalInstance = vi.hoisted(() => ({ getActiveAccount: () => null }))

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({ instance: msalInstance })
}))

const resultsLabel = (item: FdsNavigationItem) =>
  item.dropDownItems?.find((i) => i.value === '/data/results')?.label

describe('Services menu for a logged-in user', () => {
  beforeEach(async () => {
    capturedItems.items = []
    await i18next.changeLanguage('fi')
  })

  it('labels the /data/results item "Omat datajulkaisut"', () => {
    const item = myServicesItem(i18next.t, true)

    expect(resultsLabel(item)).toBe('Omat datajulkaisut')
    expect(item.dropDownItems?.map((i) => i.value)).toEqual(['/data', '/data/request', '/data/results'])
  })

  it('keeps the visitor label by default', () => {
    expect(resultsLabel(myServicesItem(i18next.t))).toBe('Testi- ja validointitulokset')
  })

  it('is used by the authenticated navbar', () => {
    render(<VacoAuthenticatedNavbar />)

    const services = capturedItems.items.find((i) => i.label === i18next.t('vaco:services'))
    expect(services).toBeDefined()
    expect(resultsLabel(services as FdsNavigationItem)).toBe('Omat datajulkaisut')
    expect(services?.dropDownItems?.map((i) => i.value)).toEqual(['/data', '/data/request', '/data/results'])
  })
})
