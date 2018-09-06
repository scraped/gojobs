import {createApp} from './app'
import {findAsyncComponents} from '@/helpers';
import {setupHttpServer} from '@/utils';

export default context => {
  const {req} = context;

  return new Promise((resolve, reject) => {
    setupHttpServer(req);

    const {app, router, store} = createApp();

    router.push(req.url);

    router.onReady(
      async () => {
        const matchedComponents = router.getMatchedComponents();

        if (router.currentRoute.name === 'error') {
          context.errorCode = 404;
        }

        const asyncDataPromises = findAsyncComponents({
          components: matchedComponents,
          store,
          route: router.currentRoute
        });

        await Promise.all(asyncDataPromises);

        context.state = store.state;
        context.meta = app.$meta(); // see vue-meta

        resolve(app);
      },

      reject
    );
  });
}
