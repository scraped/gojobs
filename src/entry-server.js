import config from '../config';
import { createApp } from './app'
import { findAsyncComponents } from './helpers';
import { setupHttp, serializeCookies } from './utils';
import { serverTitleMixin } from './mixins';
import axios from 'axios';
import Vue from 'vue';

export default context => {
  Vue.mixin({
    created: serverTitleMixin
  });

  const { req } = context;

  return new Promise((resolve, reject) => {
    const axiosInstance = axios.create({
      baseURL: `http://${req.hostname}:${config.port}/`,
      headers: {
        Cookie: serializeCookies(req.cookies)
      }
    });

    setupHttp(axiosInstance);

    const { app, router, store } = createApp();

    router.push(req.url);

    router.onReady(
      async () => {
        const matchedComponents = router.getMatchedComponents();

        if (!matchedComponents.length) {
          return reject(new Error('404'));
        }

        const asyncDataPromises = findAsyncComponents({
          components: matchedComponents,
          store,
          route: router.currentRoute
        });

        await Promise.all(asyncDataPromises);

        context.state = store.state;
        context.meta = app.$meta(); // vue-meta

        resolve(app);
      },
      reject
    );
  });
}
