import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en/translation'
import { fi } from './locales/fi/translation'
import { se } from './locales/se/translation'

const fallbackLng = ['fi']
export const localStorageKey = 'selectedLocaleCode'
export const resources = {
  en: en,
  fi: fi,
  se: se
}

export const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    fallbackLng,
    lng: localStorage.getItem(localStorageKey) || 'fi',
    //debug: true,
    resources: resources
  })
}
