import Vue from 'vue';
import { createApp } from './app';
import { findAsyncComponents } from './helpers';
import { beforeRouteUpdate, clientTitleMixin } from './mixins';
import { setupHttpClient } from './utils'

Vue.mixin({
  mounted: clientTitleMixin,
  // See docs to understand why this is necessary
  beforeRouteUpdate
});

setupHttpClient();

const { app, store, router } = createApp();

// *********************
// Replace store
// *********************

// Server filled the store - don't need to do it again
// on the client side
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

// *********************
// Main logic
// *********************

router.onReady(() => {
  store.dispatch('user/fetchUserInfo');
  // store.commit('user/setPreferences', { cookies: document.cookie })

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

    const promisesExist = asyncDataPromises.length > 0;

    if (promisesExist) {
      Vue.prototype.$Progress.start();
      await Promise.all(asyncDataPromises);
      Vue.prototype.$Progress.finish();
    }

    next();
  }); // router.beforeResolve

  app.$mount('#app');
});
