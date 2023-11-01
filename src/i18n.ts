import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './locales/en/translation.json' assert { type: 'json' }
import fiTranslation from './locales/fi/translation.json' assert { type: 'json' }
import seTranslation from './locales/se/translation.json' assert { type: 'json' }

const fallbackLng = ['fi']

export const localStorageKey = 'selectedLocaleCode'

export const i18nOptions = {
  fallbackLng,
  lng: localStorage.getItem(localStorageKey) || 'fi',
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: { ...enTranslation },
    fi: { ...fiTranslation },
    se: { ...seTranslation }
  }
}

export default i18n.use(initReactI18next).init({
  fallbackLng,
  lng: localStorage.getItem(localStorageKey) || 'fi',
  interpolation: {
    escapeValue: false
  },
  resources: {
    en: { ...enTranslation },
    fi: { ...fiTranslation },
    se: { ...seTranslation }
  }
})
