const { production } = require('../config');
const fs = require('fs');
const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer');
const setupDevServer = require('../build/setup-dev-server');

function createBundleRendererFactory({ bundle, clientManifest, template }) {
  return createBundleRenderer(bundle, {
    clientManifest,
    template,
    // https://ssr.vuejs.org/ru/api.html#webpack-plugins
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    runInNewContext: false
  });
}

module.exports = app => {
  let readyPromise = Promise.resolve(),
    renderer;

  function updateRenderer({ bundle, clientManifest, template }) {
    renderer = createBundleRendererFactory({
      bundle,
      clientManifest,
      template
    });
  }

  if (production) {
    // PRODUCTION: generate renderer
    // when using readFileSync, you must also use JSON.parse, so... require!
    // WARN: require works works from the directory in which this file is
    // located, but readFileSync in which this file is executed.
    const bundle = require(`../dist/vue-ssr-server-bundle`);
    const clientManifest = require(`../dist/vue-ssr-client-manifest`);
    const template = fs.readFileSync(`./src/index.html`, 'utf-8');

    updateRenderer({ bundle, clientManifest, template });
  } else {
    // DEVELOPMENT: wait before bundling
    readyPromise = setupDevServer(app, updateRenderer);
  }

  return async function(req, res) {
    await readyPromise;

    const context = {
      title: 'GTA Online Jobs',
      url: req.url,
      req
    };

    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.log('Ошибка:', err);
        return res.status(500).send('500 Internal Server Error.');
      }

      res.send(html);
    });
  }
};
