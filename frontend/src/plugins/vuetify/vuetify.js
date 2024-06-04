import i18n from '@/plugins/i18n'
import defaults from '@/plugins/vuetify/defaults'
import theme from '@/plugins/vuetify/theme'
import { useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

import '@/styles/skins/index.scss'
import '@/styles/vuetify/_overrides.scss'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  aliases: {
    ApiBtn: VBtn,
  },
  theme,
  defaults,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
})
