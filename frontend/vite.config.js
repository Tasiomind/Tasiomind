// Plugins
import vue from '@vitejs/plugin-vue';
import { URL, fileURLToPath } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import VueDevTools from 'vite-plugin-vue-devtools';
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
    VueDevTools(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'swiper-container' || tag === 'swiper-slide',
        },
      },
    }),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*\/*.json/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
      manifest: {
        theme_color: '#8936FF',
        background_color: '#2EC6FE',
        icons: [
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'icon512_maskable.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: 'icon512_rounded.png',
            type: 'image/png',
          },
        ],
        orientation: 'any',
        display: 'standalone',
        dir: 'auto',
        lang: 'en-EN',
        name: 'Tasiomind',
        short_name: 'TS',
        start_url: '/',
        id: 'sad',
      },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      // autoImport: true,
      styles: {
        configFile: 'src/styles/vuetify/_variables.scss',
      },
    }),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core'],
      vueTemplate: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@appConfig': fileURLToPath(new URL('./appConfig.js', import.meta.url)),
      '@axios': fileURLToPath(new URL('./src/plugins/axios.js', import.meta.url)),
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
