import { test } from '../fixtures/base'
import { expect } from '@playwright/test'
import { Environment } from '../../../types/Bootstrap'

test.describe(`Home Page, without authentication`, () => {
  test('Test landing page contents are visible', async ({ page, i18n }) => {
    // Temporarily mocking this:
    await page.route('http://localhost:8080/api/ui/bootstrap', async (route) => {
      const json = {
        environment: Environment.Local,
        baseUrl: 'http://localhost:8080',
        tenantId: 'd8536c71-f91f-4e54-b68c-215a7fd9510b',
        clientId: '57c1b8a0-f33e-4e47-840d-8c180d933c41'
      }
      await route.fulfill({ json })
    })

    await page.goto('/ui')
    await expect(page.getByRole('heading', { name: i18n.t('home:header') })).toBeVisible()
    await expect(page.getByRole('heading', { name: i18n.t('home:shortcuts') })).toBeVisible()

    // Shortcuts:
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('ad:login')}`)).toBeVisible()
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('ad:create')}`)).toBeVisible()
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('vaco:myData')}`)).not.toBeVisible()
    await expect(page.locator(`.shortcut-card__label >> text=${i18n.t('vaco:testData')}`)).not.toBeVisible()

    // VACO menu:
    await expect(page.locator(`.item__label--bold >> span >> text=${i18n.t('vaco:vaco')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('vaco:about')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:privacy')}`)).toHaveCount(1)
    await page.locator(`span >> text=${i18n.t('vaco:about')}`).click()
    await expect(page.locator(`li >> text=${i18n.t('vaco:instructions')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:terms')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('vaco:privacy')}`)).toHaveCount(2)

    await expect(page.locator(`span >> text=${i18n.t('vaco:support')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('ad:login')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('ad:register')}`)).toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('vaco:myData')}`)).not.toBeVisible()
    await expect(page.locator(`span >> text=${i18n.t('vaco:testData')}`)).not.toBeVisible()

    await expect(page.locator(`span >> text=${i18n.t('locales:fi')}`)).toBeVisible()
    await page.locator(`span >> text=${i18n.t('locales:fi')}`).click()
    await expect(page.locator(`li >> text=${i18n.t('locales:en')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('locales:se')}`)).toBeVisible()
    await expect(page.locator(`li >> text=${i18n.t('locales:fi')}`)).toHaveCount(2)
  })
})
