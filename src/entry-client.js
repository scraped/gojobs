import { createApp } from './app';
import findAsyncComponents from './find-async-components';

const { app, store, router } = createApp();

if (window.__INITIAL_STATE__) {
  console.log('initial state!')
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  console.log('onready')
  router.beforeResolve(async (to, from, next) => {
    console.log('beforeresolve')
    const matchedPrev = router.getMatchedComponents(from);
    const matched = router.getMatchedComponents(to);

    let diffed = false;
    const activated = matched.filter((Component, i) => {
      return diffed || (diffed = (matchedPrev[i] !== Component));
    });

    if (!activated.length) {
      return next();
    }

    // <индикатор загрузки вкл>

    const asyncDataPromises = findAsyncComponents({
      components: activated,
      store,
      route: to
    });

    await Promise.all(asyncDataPromises);

    // <индикатор загрузки выкл>

    next();
  });

  app.$mount('#app');
});
