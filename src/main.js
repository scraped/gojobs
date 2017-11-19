import './scss/main.scss'

import Vue from 'vue';
import VueResource from 'vue-resource';
import VueProgressBar from 'vue-progressbar';
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor';
import VueAgile from 'vue-agile';
import InfiniteScroll from 'vue-infinite-scroll';

import App from './App.vue';
import router from './router';
import store from './store';
import { sync } from 'vuex-router-sync';

sync(store, router);

const progressBarOptions = {
  color: '#EB0000',
  failedColor: 'red',
};

Vue.use(VueResource);
Vue.use(VueProgressBar, progressBarOptions);
Vue.use(VueResourceProgressBarInterceptor);
Vue.use(VueAgile);

new Vue({
  el: '#app',
  render: h => h(App),
  directives: { 'infinite-scroll': InfiniteScroll },
  router,
  store
});
