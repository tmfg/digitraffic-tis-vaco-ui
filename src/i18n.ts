import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from '../public/locales/en/translation.json'
import fiTranslation from '../public/locales/fi/translation.json'
import seTranslation from '../public/locales/se/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enTranslation },
    fi: { ...fiTranslation },
    se: { ...seTranslation }
  },
  lng: 'en'
})
