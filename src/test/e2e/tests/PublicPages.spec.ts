import { test } from '../fixtures/base'
import { expect } from '@playwright/test'
import * as dotenv from 'dotenv'
import { VacoResourcesPage } from '../model/VacoResources.page.ts'
import { APIMockingPage } from '../model/APIMocking.page.ts'
import { shortcutCardSelector } from '../utils/NavigationUtils.ts'

dotenv.config()

// Visitors have no login. These specs never call LoginPage.login().
test.describe(`Public pages, without authentication`, () => {
  test('Visitor opens the data delivery page from the home page', async ({ page, i18n }) => {
    const authorizationHeaders: (string | undefined)[] = []
    const ApiMockingPage = new APIMockingPage(page)
    await ApiMockingPage.APIMocking()
    await page.route('**/api/ui/data-delivery', async (route) => {
      authorizationHeaders.push(route.request().headers()['authorization'])
      await route.fulfill({ json: [] })
    })
    const ResourcesPage = new VacoResourcesPage(page)
    await ResourcesPage.navigate()

    await expect(page.locator(shortcutCardSelector(i18n.t('home:shortcut:dataDelivery:label')))).toBeVisible()
    await page.locator(shortcutCardSelector(i18n.t('home:shortcut:dataDelivery:label'))).click()

    await expect(page.getByRole('heading', { name: i18n.t('admin:dataDelivery:header') })).toBeVisible()
    await expect(page.getByText(i18n.t('error:authRequired'))).toHaveCount(0)
    expect(authorizationHeaders.length).toBeGreaterThan(0)
    expect(authorizationHeaders.every((header) => header === undefined)).toBe(true)
  })

  test('Visitor opens the test data form from the home page', async ({ page, i18n }) => {
    const ApiMockingPage = new APIMockingPage(page)
    await ApiMockingPage.APIMocking()
    await page.route('**/api/ui/rules*', async (route) => {
      await route.fulfill({ json: [] })
    })
    const ResourcesPage = new VacoResourcesPage(page)
    await ResourcesPage.navigate()

    await page.locator(shortcutCardSelector(i18n.t('home:shortcut:testData:label'))).click()

    await expect(page.getByRole('heading', { name: i18n.t('services:testData:header') })).toBeVisible()
    await expect(page.getByText(i18n.t('error:authRequired'))).toHaveCount(0)
  })
})
