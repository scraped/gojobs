import config from '../config';
import { createApp } from './app'
import { findAsyncComponents, setupAxios } from './helpers';

export default context => {
  const { req } = context;

  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    if (req.session) {
      const { username, jobname } = req.session;
      if (username) store.commit('auth/setUsername', { username });
      if (jobname) store.commit('auth/setJobname', { jobname });
    }

    setupAxios({
      host: req.hostname,
      port: config.port
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
