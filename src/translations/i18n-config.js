const { join } = require('path');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

i18next
  .use(middleware.LanguageDetector)
  .use(Backend)
  .init({
    preload: ['en', 'es'],
    backend: {
      loadPath: __dirname + '/locales/{{lng}}.json'
    }
  })

module.exports = i18next;
