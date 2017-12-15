import { createApp } from './app'

export default async context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(context.url);

    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents) {
        throw new Error({ code: 404 });
      }

      await Promise.all(matchedComponents.map(Component => {
        // If Component has fetchData static method
        if (Component.fetchData) {
          return Component.fetchData({
            store,
            route: router.currentRoute
          });
        }
      }));

      context.state = store.state;

      resolve(app);
    }, reject); // router.onReady

  });
}
