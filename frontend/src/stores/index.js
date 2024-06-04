import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

const STORE_NAME = 'settings';

export const useStore = defineStore('main', {
  state: () => ({
    settings: useStorage(
      STORE_NAME,
      {
        fontSize: 14,
        tabSize: 2,
        zoomLevel: 0,
      },
      localStorage,
      {
        mergeDefaults: true,
      },
    ),
  }),
  actions: {
    updateSettings(partialSettings) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      };
    },
  },
});
