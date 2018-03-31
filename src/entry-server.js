import config from '../config';
import { createApp } from './app'
import { findAsyncComponents } from './helpers';
import { setupHttp } from './utils';
import axios from 'axios';
// import {serverTitleMixin} from './mixins';

// Vue.mixin({
//   created: serverTitleMixin
// });

export default context => {
  const { req } = context;

  return new Promise((resolve, reject) => {
    const axiosInstance = axios.create({
      baseURL: `http://${req.hostname}:${config.port}/`,
      headers: {
        Cookie: `jwt=${req.cookies.jwt}`
      }
    });

    setupHttp(axiosInstance);

    const { app, router, store } = createApp();

    router.push(context.url);

    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();

      // if (!matchedComponents.length) {
      //   throw new Error({code: 404});
      // }

      const asyncDataPromises = findAsyncComponents({
        components: matchedComponents,
        store,
        route: router.currentRoute
      });

      await Promise.all(asyncDataPromises);

      context.state = store.state;

      resolve(app);
    }, reject); // router.onReady
  });
}
