import Vue from 'vue';
import axios from 'axios';
import {createApp} from './app';
import {findAsyncComponents} from './helpers';
import {beforeRouteUpdate, clientTitleMixin} from './mixins';

const { app, store, router } = createApp();

// *********************
// Mixins
// *********************

Vue.mixin({
  mounted: clientTitleMixin,
  // See docs to understand why this is necessary
  beforeRouteUpdate
});

// *********************
// Axios setup
// *********************

const openSnackbar = Vue.prototype.$snackbar.open;

const axiosInstance = axios.create({
  validateStatus(status) {
     // Reject only if the status code is greater than or equal to 500
    return status < 500;
  }
});

axiosInstance.interceptors.request.use(() => {}, () => {
  openSnackbar({
    message: 'Error: could not complete request',
    type: 'is-danger',
    position: 'is-top'
  });
});

axiosInstance.interceptors.response.use(response => {
  openSnackbar({
    message: response.data.message,
    duration: 10000,
    position: 'is-top',
  });
}, error => {
  if (error.response) {
    openSnackbar({
      message: 'Internal server error occured',
      type: 'is-danger',
      position: 'is-top'
    });
  } else {
    openSnackbar({
      message: 'An unexpected error occurred during the HTTP request' + error,
      type: 'is-danger',
      position: 'is-top'
    });
  }
});

Vue.prototype.$axios = axiosInstance;

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
