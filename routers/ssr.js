const config = require('../config');
const fs = require('fs');
const LRU = require('lru-cache');
const { createBundleRenderer } = require('vue-server-renderer');
const setupDevServer = require('../setup-dev-server');

const { production } = config;

function createBRendererFactory({ bundle, clientManifest, template }) {
  return createBundleRenderer(bundle, {
    clientManifest,
    template,
    // info about caching: https://ssr.vuejs.org/ru/api.html#webpack-plugins
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    runInNewContext: false
  })
}

module.exports = app => {
  let readyPromise = Promise.resolve();
  let renderer;

  if (production) {
    // when using readFileSync, you must also use JSON.parse, so... require!
    // WARN: require works works from the directory in which this file is
    // located, but readFileSync in which this file is executed.
    const bundle = require(`../${config.distDir}/vue-ssr-server-bundle`);
    const clientManifest = require(`../${config.distDir}/vue-ssr-client-manifest`);
    const template = fs.readFileSync(`${config.srcDir}/index.html`, 'utf-8');

    renderer = createBRendererFactory({ bundle, clientManifest, template });
  } else {
    // development: wait before bundling
    readyPromise = setupDevServer(
      app,
      function updateCallback({ bundle, clientManifest, template }) {
        renderer = createBRendererFactory({ bundle, clientManifest, template });
      }
    );
  }

  app.get('*', async (req, res) => {
    await readyPromise;

    const context = {
      title: 'GTA Online Jobs',
      url: req.url
    };

    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.log('Ошибка:', err);
        return res.send('Ошибка!');
      }
      res.send(html);
    });
  });
};
