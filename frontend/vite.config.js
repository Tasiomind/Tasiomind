// Plugins
import vue from '@vitejs/plugin-vue';
import { URL, fileURLToPath } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import VueDevTools from 'vite-plugin-vue-devtools';
import pwaConfig from './pwa.config';
import vuetify from 'vite-plugin-vuetify';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';

// Utilities
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
  plugins: [
    mkcert(),
    // VueDevTools(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'swiper-container' || tag === 'swiper-slide',
        },
      },
    }),
    VitePWA(pwaConfig),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/vuetify/_variables.scss',
      },
    }),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      imports: [
        'vue',
        'vue-i18n',
        'vue-router',
        'pinia',
        {
          '@vueuse/core': [
            'useMouse', // import { useMouse } from '@vueuse/core',
            ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
          ],
          'axios': [
            ['default', 'axios'], // import { default as axios } from 'axios',
          ],
          'vue3-toastify': [
            'useToast', // import { useToast } from 'vue-toastification',
            'toast', // import { toast } from 'vue-toastification',
          ],
          'pinia': [
            'createPinia', // import { createPinia } from 'pinia',
            'defineStore', // import { defineStore } from 'pinia',
          ],
          'vuetify': ['useTheme'],
          'vue-router': [
            'useRoute', // import { useRoute } from 'vue-router',
            'useRouter', // import { useRouter } from 'vue-router',
          ],
          '@vue/apollo-composable': [
            'useQuery', // import { useQuery } from '@vue/apollo-composable',
            'useMutation', // import { useMutation } from '@vue/apollo-composable',
          ],
        },
        {
          from: 'vue-router',
          imports: ['RouteLocationRaw'],
          type: true,
        },
      ],
      vueTemplate: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@appConfig': fileURLToPath(new URL('./appConfig.js', import.meta.url)),
      '@axios': fileURLToPath(new URL('./src/plugins/axios.js', import.meta.url)),
      '@mutations': fileURLToPath(new URL('./src/plugins/graphql/mutations', import.meta.url)),
      '@queries': fileURLToPath(new URL('./src/plugins/graphql/queries', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    host: true,
    port: 3000,
    https: true,
    proxy: {
      '/graphql': {
        target: 'https://localhost:4000/graphql',
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: path => path.replace(/^\/graphql/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy-Fehler:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Anfrage an den Zielserver gesendet:', req.method, req.url);
          });
        },
      },
      '/api': {
        target: 'https://localhost:4000/api',
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: path => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy-Fehler:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Anfrage an den Zielserver gesendet:', req.method, req.url);
          });
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue', '@apollo/client/core', '@apollo/client/cache'],
  },
});
