import config from '../config';
import { createApp } from './app'
import { findAsyncComponents, setupAxios } from './helpers';
import Vue from 'vue';

export default context => {
  const { req } = context;

  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // if (context.session) {
    //   store.commit('user/setSession', { session: context.session.id });
    // }

    Vue.prototype.$axios = setupAxios({
      host: req.hostname,
      port: config.port,
      sessionId: req.session.id
    });

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
