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
  color: '#75c1ff',
  failedColor: 'red',
  thickness: '6px'
};

Vue.use(VueResource);
Vue.use(VueProgressBar, progressBarOptions);
Vue.use(VueResourceProgressBarInterceptor);
Vue.use(VueAgile);

Vue.filter('formatNumber', num => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'm';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'k';
  return num;
});

new Vue({
  el: '#app',
  render: h => h(App),
  directives: { 'infinite-scroll': InfiniteScroll },
  router,
  store
});
