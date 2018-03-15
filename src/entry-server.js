import { createApp } from './app'
import findAsyncComponents from './helpers/find-async-components';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    if (context.user.jobname) {
      store.commit('user/setJobname', { jobname: context.user.jobname });
    }

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
