import { test } from '../fixtures/base'
import { expect } from '@playwright/test'
import * as dotenv from 'dotenv'
import { VacoResourcesPage } from '../model/VacoResources.page.ts'
import { Login } from '../model/Login.page.ts'
import { APIMockingPage } from '../model/APIMocking.page.ts'
import { shortcutCardSelector, sortableColumnSelector } from '../utils/NavigationUtils.ts'

dotenv.config()

test.describe(`My data page`, () => {
  test('Test my data page elements are visible', async ({ page, i18n }) => {
    const ApiMockingPage = new APIMockingPage(page)
    await ApiMockingPage.APIMocking()
    const ResourcesPage = new VacoResourcesPage(page)
    await ResourcesPage.navigate()
    const LoginPage = new Login(page)
    await LoginPage.login()

    await expect(page.locator(shortcutCardSelector(i18n.t('home:shortcut:myData:label')))).toBeVisible()
    await page.locator(shortcutCardSelector(i18n.t('home:shortcut:myData:label'))).click()
    await expect(page.getByRole('heading', { name: i18n.t('services:myData:header') })).toBeVisible()
    await expect(page.getByRole('heading', { name: i18n.t('services:myData:find') })).toBeVisible()

    const searchWordTextBox = page.locator('[name=searchWord]')
    await searchWordTextBox.fill('hsl') //just something to test the fill
    await page.getByRole('button', { name: i18n.t('common:search') }).click()

    await expect(page.getByRole('heading', { name: i18n.t('services:myData:latest') })).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:id')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:context')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:feedName')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:format')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:dateCreated')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:dateStarted')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:dateCompleted')))).toBeVisible()
    await expect(page.locator(sortableColumnSelector(i18n.t('services:myData:table:status')))).toBeVisible()
  })
})
