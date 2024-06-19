export default {
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
};
