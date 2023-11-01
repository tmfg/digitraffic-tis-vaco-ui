import { createI18nFixture } from 'playwright-i18next-fixture'
import { test as baseTest } from '@playwright/test'
import enTranslation from '../../locales/en/translation.json' assert { type: 'json' }
import fiTranslation from '../../locales/fi/translation.json' assert { type: 'json' }
import seTranslation from '../../locales/se/translation.json' assert { type: 'json' }

export const i18nFixture = createI18nFixture({
  options: {
    lng: 'fi',
    resources: {
      en: { ...enTranslation },
      fi: { ...fiTranslation },
      se: { ...seTranslation }
    }
  },
  // Fetch translations in every test or fetch once
  // Default: true
  cache: true,
  // Run as auto fixture to be available through all tests by getI18nInstance()
  // Default: true
  auto: true
})

export const test = baseTest.extend(i18nFixture)
