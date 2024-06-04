const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const { join, resolve } = require('path');
const { readdirSync, lstatSync } = require('fs');

const localesDir = resolve('locales/translations');

module.exports = i18next
  .use(middleware.LanguageDetector)
  .use(Backend)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    preload: readdirSync(localesDir).filter(fileName => {
      const joinedPath = join(localesDir, fileName);
      return lstatSync(joinedPath).isDirectory();
    }),
    backend: {
      loadPath: join(localesDir, '{{lng}}/{{ns}}.json'),
    },
  });

module.exports = app => {
  app.use(middleware.handle(i18next));
};
