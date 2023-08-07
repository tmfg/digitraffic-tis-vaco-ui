import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './locales/en/translation.json'
import fiTranslation from './locales/fi/translation.json'
import seTranslation from './locales/se/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enTranslation },
    fi: { ...fiTranslation },
    se: { ...seTranslation }
  },
  lng: 'en'
})
