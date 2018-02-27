import Vue from 'vue';
import { createApp } from './app';
import findAsyncComponents from './helpers/find-async-components';

const { app, store, router } = createApp();

Vue.mixin({
  async beforeRouteUpdate(to, from, next) {
    const { fetchData } = this.$options;

    if (fetchData) {
      this.$Progress.start();
      await fetchData({
        store: this.$store,
        route: to
      });
      this.$Progress.finish();
    }

    next();
  }
});

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
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

    const asyncDataPromises = findAsyncComponents({
      components: activated,
      store,
      route: to
    });

    const showProgressBar = asyncDataPromises.length > 0;

    if (showProgressBar) Vue.prototype.$Progress.start();

    await Promise.all(asyncDataPromises);

    if (showProgressBar) Vue.prototype.$Progress.finish();

    next();
  });

  app.$mount('#app');
});
