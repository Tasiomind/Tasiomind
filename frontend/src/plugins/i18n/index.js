import { appConfig } from '@appConfig'
import { createI18n } from 'vue-i18n'
import en from './messages/en'
import de from './messages/de'

const messages = {
  en,
  de,
}

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('app-locale') || appConfig.defaultLocale.value,
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  datetimeFormats: {
    'en': {
      short: {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
      },
      dateonly: {
        year: 'numeric', month: '2-digit', day: '2-digit'
      },
    },
    'de': {
      short: {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
      },
      dateonly: {
        year: 'numeric', month: '2-digit', day: '2-digit'
      },
    }

  },
  messages,
})
