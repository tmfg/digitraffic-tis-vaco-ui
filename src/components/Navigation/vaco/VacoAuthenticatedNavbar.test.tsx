import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import i18next from 'i18next'
import VacoAuthenticatedNavbar from './VacoAuthenticatedNavbar'
import {
  adminToolsItem,
  aboutItem,
  getSelectedLocaleItem,
  myServicesItem,
  supportItem,
  userItem,
  vacoItem
} from './navbarItems'
import { itemsOf, labelTree, renderWithBars, selectLanguage } from './navbarTestUtils'
import { AppContext } from '../../../AppContextProvider'

const accountName = 'Test Admin'

const msal = vi.hoisted(() => ({
  instance: { getActiveAccount: () => ({ name: 'Test Admin' }) }
}))

vi.mock('@azure/msal-react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@azure/msal-react')>()),
  useMsal: () => ({ instance: msal.instance, accounts: [], inProgress: 'none' })
}))
vi.mock('../../EnvironmentBar/EnvironmentBar', () => ({ default: () => <div /> }))
vi.mock('../../fds/FdsNavigationComponent', async () => ({
  FdsNavigationComponent: (await import('./navbarTestUtils')).FakeNavigation
}))

describe('VACO menu bar for a logged-in admin after a language change', () => {
  let cleanupBars: () => void = () => {}

  beforeEach(async () => {
    localStorage.clear()
    await i18next.changeLanguage('fi')
  })

  afterEach(async () => {
    cleanupBars()
    await i18next.changeLanguage('fi')
  })

  const expectedEnglishItems = () => {
    const en = i18next.getFixedT('en')
    const user = userItem(en)
    user.label = accountName
    user.dropDownItems?.push({ label: en('vaco:logout'), value: () => {} })
    return [
      vacoItem(),
      aboutItem(en),
      supportItem(en),
      myServicesItem(en),
      adminToolsItem(en),
      user,
      getSelectedLocaleItem('en', en)
    ]
  }

  it('shows every label in the new language without a reload', async () => {
    const { vacoBar, cleanupBars: cleanup } = renderWithBars(
      <AppContext.Provider value={{ companies: undefined, roles: ['vaco.admin'] }}>
        <VacoAuthenticatedNavbar />
      </AppContext.Provider>
    )
    cleanupBars = cleanup
    await waitFor(() => expect(itemsOf(vacoBar).map((i) => i.label)).toContain(i18next.getFixedT('fi')('admin:tools')))

    await selectLanguage(vacoBar, 'en')

    const expected = labelTree(expectedEnglishItems())
    expect(JSON.stringify(expected)).toContain(i18next.getFixedT('en')('admin:tools'))
    await waitFor(() => expect(labelTree(itemsOf(vacoBar))).toEqual(expected))
  })
})
