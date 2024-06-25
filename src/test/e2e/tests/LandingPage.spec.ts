import { test } from '../fixtures/base'
import { expect } from '@playwright/test'
import { VacoResourcesPage } from '../model/VacoResources.page.ts'
import { APIMockingPage } from '../model/APIMocking.page.ts'

test.describe(`Home Page, without authentication`, () => {
  test('Test landing page contents are visible', async ({ page, i18n }) => {
    const ApiMockingPage = new APIMockingPage(page)
    await ApiMockingPage.APIMocking()
    const ResourcesPage = new VacoResourcesPage(page)
    await ResourcesPage.navigate()

    await expect(page.getByRole('heading', { name: i18n.t('home:header') })).toBeVisible()
    await expect(page.getByRole('heading', { name: i18n.t('home:shortcuts') })).toBeVisible()

    // Shortcuts:
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('vaco:login')}`)).toBeVisible()
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('vaco:register')}`)).toBeVisible()
    await expect(
      page.locator(`.shortcut-card__label >> text=${i18n.t('home:shortcut:myData:label')}`)
    ).not.toBeVisible()
    await expect(
      page.locator(`.shortcut-card__label >> text=${i18n.t('home:shortcut:testData:label')}`)
    ).not.toBeVisible()

    // VACO menu:
    await expect(page.locator(`.item__label--bold >> span >> text=${i18n.t('vaco:vaco')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('vaco:about')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:privacy')}`)).toHaveCount(1)
    await page.locator(`span >> text=${i18n.t('vaco:about')}`).click()
    await expect(page.locator(`li >> text=${i18n.t('vaco:instructions')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:terms')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:privacy')}`)).toHaveCount(2)

    await expect(page.locator(`span >> text=${i18n.t('vaco:support')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('vaco:login')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('vaco:register')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('home:shortcut:myData:label')}`)).not.toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('home:shortcut:testData:label')}`)).not.toBeVisible()

    await expect(page.locator(`span >> text=${i18n.t('locales:fi')}`)).toBeVisible()
    await page.locator(`span >> text=${i18n.t('locales:fi')}`).click()
    await expect(page.locator(`li >> text=${i18n.t('locales:en')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('locales:sv')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('locales:fi')}`)).toHaveCount(2)
  })
})
