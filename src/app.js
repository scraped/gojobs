import Vue from 'vue';
import App from './App.vue';
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync';
import * as filters from './utils/filters';

import VueResource from 'vue-resource';
import VueProgressBar from 'vue-progressbar';
import Buefy from 'buefy';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

const progressBarOptions = {
  color: '#75c1ff',
  failedColor: 'red',
  thickness: '6px'
};

Vue.use(VueResource);
Vue.use(VueProgressBar, progressBarOptions);

Vue.component(Buefy.Tabs.name, Buefy.Tabs);

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
