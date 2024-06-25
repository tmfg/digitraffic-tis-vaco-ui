import { test } from '../fixtures/base'
import { expect } from '@playwright/test'
import * as dotenv from 'dotenv'
import { VacoResourcesPage } from '../model/VacoResources.page.ts'
import { Login } from '../model/Login.page.ts'
import { APIMockingPage } from '../model/APIMocking.page.ts'

dotenv.config()

test.describe(`My account page`, () => {
  test('Test my account page contents are visible', async ({ page, i18n }) => {
    const ApiMockingPage = new APIMockingPage(page)
    await ApiMockingPage.APIMocking()
    const ResourcesPage = new VacoResourcesPage(page)
    await ResourcesPage.navigate()
    const LoginPage = new Login(page)
    await LoginPage.login()

    const vacoUser = page.locator('li.item__first-right > div.item__label > span')
    const vacoUserValue = await vacoUser.textContent()
    await page.locator(`span >> text=${vacoUserValue}`).click()
    await expect(page.locator(`li >> text=${i18n.t('vaco:user')}`)).toBeVisible()
    await page.locator(`li >> text=${i18n.t('vaco:user')}`).click()

    await expect(page.getByRole('heading', { name: i18n.t('vaco:user') })).toBeVisible()

    await expect(page.locator(`span >> text=${i18n.t('user:name')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('user:username')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('user:email')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('user:roles')}`)).toBeVisible()
  })
})
