import Vue from 'vue';
import {createApp} from './app'
import {findAsyncComponents} from '@/helpers';
import {setupHttpService} from '@/services/http';

export default context => {
  const {req} = context;

  setupHttpService({
    http: req.http
  });

  return new Promise((resolve, reject) => {
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
};
