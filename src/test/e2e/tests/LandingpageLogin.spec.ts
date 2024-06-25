import { test } from '../fixtures/base'
import { expect } from '@playwright/test'
import * as dotenv from 'dotenv'
import { VacoResourcesPage } from '../model/VacoResources.page.ts'
import { Login } from '../model/Login.page.ts'
import { APIMockingPage } from '../model/APIMocking.page.ts'

dotenv.config()

test.describe(`Home Page, with authentication, admin rights`, () => {
  test('Test home page contents are visible logged in', async ({ page, i18n }) => {
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
    await expect(page.locator(`li >> text=${i18n.t('vaco:logout')}`)).toBeVisible()
    await page.locator(`span >> text=${i18n.t('vaco:services')}`).click()
    await expect(page.locator(`li >> text=${i18n.t('vaco:myData')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:testData')}`)).toBeVisible()

    await page.locator(`span >> text=${i18n.t('admin:tools')}`).click()
    await expect(page.locator(`li >> text=${i18n.t('admin:dataDelivery:header')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('admin:companies:header')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('admin:featureFlags:header')}`)).toBeVisible()

    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('home:shortcut:myData:label')}`)).toBeVisible()
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('home:shortcut:testData:label')}`)).toBeVisible()
    await expect(
      page.locator(`.shortcut-card__label >> text=${i18n.t('home:shortcut:dataDelivery:label')}`)
    ).toBeVisible()
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('home:shortcut:companies:label')}`)).toBeVisible()
  })
})
