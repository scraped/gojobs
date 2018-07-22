const {production} = require('../config');
const fs = require('fs');
const lru = require('lru-cache');
const {createBundleRenderer} = require('vue-server-renderer');
const setupDevServer = require('../build/setup-dev-server');

module.exports = {
  ssrMiddleware
};

/**
 * Performs SSR.
 * @param {object} app express instance
 * @return {undefined}
 */
function ssrMiddleware(app) {
  let readyPromise = Promise.resolve();
  let renderer;

  const updateRenderer = ({ bundle, clientManifest, template }) => {
    renderer = createBundleRenderer(bundle, {
      clientManifest,
      template,
      // https://ssr.vuejs.org/ru/api.html#webpack-plugins
      cache: lru({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      runInNewContext: false
    });
  }

  if (production) {
    // PRODUCTION: generate renderer.
    // when using readFileSync, you must also use JSON.parse, so... require!
    // WARN: require works works from the directory in which this file is
    // located, but readFileSync in which this file is executed.
    const bundle = require('../dist/vue-ssr-server-bundle');
    const clientManifest = require('../dist/vue-ssr-client-manifest');
    const template = fs.readFileSync('./src/index.html', 'utf-8');

    updateRenderer({ bundle, clientManifest, template });
  } else {
    // DEVELOPMENT: wait before bundling
    readyPromise = setupDevServer(app, updateRenderer);
  }

  app.use(async (req, res, next) => {
    try {
      await readyPromise;

      const context = {
        req
      };

      const html = await renderer.renderToString(context);
      res.send(html);
    } catch (error) {
      return next(error);
    }
  });

  // eslint-disable-next-line
  app.use((err, req, res, next) => {
    const { message } = err;

    if (message === '404') {
      res.status(404).send('404 Not Found');
    } else {
      console.log(err);
      res.status(500).send('500 Internal Server Error');
    }
  })
}
