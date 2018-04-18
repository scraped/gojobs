import config from '../config';
import { createApp } from './app'
import { findAsyncComponents } from './helpers';
import { setupHttp, serializeCookies } from './utils';
import axios from 'axios';

export default context => {
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

    router.push(context.url);

    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents.length) {
        // stringify because new error accepts only strings
        return reject(new Error(JSON.stringify({ code: 404 })));
      }

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
