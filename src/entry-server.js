import config from '../config';
import Vue from 'vue';
import {createApp} from './app'
import {findAsyncComponents, setAxios} from './helpers';
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

    Vue.prototype.$axios = axiosInstance;

    setAxios(axiosInstance);

    const { app, router, store } = createApp();

    router.push(context.url);

    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents) {
        throw new Error({ code: 404 });
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
