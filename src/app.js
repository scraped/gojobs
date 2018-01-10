import './scss/main.scss'

////////////////////////////////////////

import Vue from 'vue';
import App from './App.vue';
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync';
import * as filters from './utils/filters';

import VueResource from 'vue-resource';
// import VueProgressBar from 'vue-progressbar';
// import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor';
// import VueAgile from 'vue-agile';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// const progressBarOptions = {
//   color: '#75c1ff',
//   failedColor: 'red',
//   thickness: '6px'
// };

Vue.use(VueResource);
// Vue.use(VueProgressBar, progressBarOptions);
// Vue.use(VueResourceProgressBarInterceptor);
// Vue.use(VueAgile);

export function createApp() {
  const store = createStore();
  const router = createRouter();

  sync(store, router);

  const app = new Vue({
    render: h => h(App),
    store,
    router
  });

  return { app, store, router };
}
