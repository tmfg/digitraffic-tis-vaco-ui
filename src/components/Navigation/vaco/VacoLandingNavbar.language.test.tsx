import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import i18next from 'i18next'
import VacoLandingNavbar from './VacoLandingNavbar'
import { aboutItem, getSelectedLocaleItem, loginItem, myServicesItem, supportItem, vacoItem } from './navbarItems'
import { checkedValues, itemsOf, labelTree, renderWithBars, selectLanguage } from './navbarTestUtils'
import { localStorageKey } from '../../../i18n'

vi.mock('../../EnvironmentBar/EnvironmentBar', () => ({ default: () => <div /> }))
vi.mock('../../fds/FdsNavigationComponent', async () => ({
  FdsNavigationComponent: (await import('./navbarTestUtils')).FakeNavigation
}))

describe('VACO menu bar for a visitor after a language change', () => {
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
    return [
      vacoItem(),
      aboutItem(en),
      supportItem(en),
      myServicesItem(en),
      loginItem(en),
      getSelectedLocaleItem('en', en)
    ]
  }

  it('shows every label in the new language without a reload', async () => {
    const { vacoBar, cleanupBars: cleanup } = renderWithBars(<VacoLandingNavbar />)
    cleanupBars = cleanup
    expect(itemsOf(vacoBar).map((i) => i.label)).toContain(i18next.getFixedT('fi')('vaco:services'))

    await selectLanguage(vacoBar, 'en')

    const expected = labelTree(expectedEnglishItems())
    expect(JSON.stringify(expected)).toContain(i18next.getFixedT('en')('vaco:services'))
    await waitFor(() => expect(labelTree(itemsOf(vacoBar))).toEqual(expected))
  })

  it('keeps the selected language in local storage and marks it in the language item', async () => {
    const { vacoBar, cleanupBars: cleanup } = renderWithBars(<VacoLandingNavbar />)
    cleanupBars = cleanup

    await selectLanguage(vacoBar, 'en')

    await waitFor(() => expect(localStorage.getItem(localStorageKey)).toBe('en'))
    const items = itemsOf(vacoBar)
    const localeItem = items[items.length - 1]
    expect(localeItem?.label).toBe(i18next.getFixedT('en')('locales:en'))
    expect(checkedValues(itemsOf(vacoBar))).toEqual(['/locales/en'])
  })
})
