import { createApp } from './app'
import { findAsyncComponents } from './helpers';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    if (context.cookies) {
      console.log(context.cookies);
      store.commit('user/setCookies', { cookies: context.cookies });
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
