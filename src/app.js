import Vue from 'vue';
import {sync} from 'vuex-router-sync';
import VueProgressBar from 'vue-progressbar';
import VueCookie from 'vue-cookie';
import VueMeta from 'vue-meta';
import Buefy from 'buefy';

import App from './App.vue';
import {createStore} from './store';
import {createRouter} from './router';
import * as filters from './filters';

Object.keys(filters)
  .forEach(key => {
    Vue.filter(key, filters[key]);
  });

const progressBarOptions = {
  color: '#75c1ff',
  failedColor: 'red',
  thickness: '6px',
};

const buefyOptions = {
  defaultNoticeQueue: false,
  defaultSnackbarDuration: 10000,
  defaultToastDuration: 10000,
  defaultIconPack: 'fa',
};

Vue.use(VueProgressBar, progressBarOptions);
Vue.use(VueCookie);
Vue.use(Buefy, buefyOptions);
Vue.use(VueMeta);

export default function createApp() {
  const store = createStore();
  const router = createRouter();

  sync(store, router);

  const app = new Vue({
    render: h => h(App),
    store,
    router,
  });

  return {app, store, router};
}
