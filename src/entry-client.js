import { createApp } from './app';

const { app, store, router } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve(async (to, from, next) => {
    const matchedPrev = router.getMatchedComponents(from);
    const matched = router.getMatchedComponents(to);

    let diffed = false;
    const activated = matched.filter((Component, i) => {
      return diffed || (diffed = (matchedPrev[i] !== Component));
    });

    if (!activated.length) {
      return next();
    }

    // ИНДИКАТОР ЗАГРУЗКИ

    await Promise.all(activated.map(Component => {
      if (Component.fetchData) {
        return Component.fetchData({
          store,
          route: to
        });
      }
    }));

    // ИНДИКАТОР ЗАГРУЗКИ ВЫКЛ

    next();
  });



  app.$mount('#app');
});
