import vueI18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify/vuetify';
import { createPinia } from 'pinia';
import Vue3Toastify from 'vue3-toastify';
import router from '@/router';

const pinia = createPinia();

const toastifyOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  duration: 3000,
  className: 'toastify',
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
};

// Register plugins function
export const registerPlugins = app => {
  app.use(vuetify).use(pinia).use(router).use(vueI18n).use(Vue3Toastify, toastifyOptions);
};
