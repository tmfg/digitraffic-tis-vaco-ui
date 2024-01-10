import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en/translation'
import { fi } from './locales/fi/translation'
import { sv } from './locales/sv/translation'

export const fallbackLng = ['fi']
export const supportedLocales = ['fi', 'sv', 'en']
export const localStorageKey = 'selectedLocaleCode'
export const resources = {
  en: en,
  fi: fi,
  sv: sv
}

export const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    fallbackLng,
    lng: localStorage.getItem(localStorageKey) || 'fi',
    //debug: true,
    resources: resources
  })
}
