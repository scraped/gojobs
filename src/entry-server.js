import { createApp } from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(context.url);
    console.log(context.url);

    router.onReady(async () => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents) {
        throw new Error({ code: 404 });
      }

      await Promise.all(matchedComponents.map(Component => {
        console.log('yes!!', Component);
        // If Component has fetchData static method
        if (Component.fetchData) {
          console.log('yes2!!', Component);
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
