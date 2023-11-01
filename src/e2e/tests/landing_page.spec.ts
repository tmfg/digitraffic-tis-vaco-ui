import { test } from '../fixtures/i18n_setup'
import { expect } from '@playwright/test'

test('Test landing page contents are visible', async ({ page, i18n }) => {
  await page.goto('/')
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
