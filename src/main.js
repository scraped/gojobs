import './scss/main.scss'
import moment from 'moment';

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
  const MILLION = 1000000;
  const THOUSAND = 1000;

  if (num >= MILLION) return (num / MILLION).toFixed(2) + 'm';
  if (num >= THOUSAND) return (num / THOUSAND).toFixed(2) + 'k';

  return num;
});

Vue.filter('formatDate', date => {
  return moment(date).fromNow();
})

new Vue({
  el: '#app',
  render: h => h(App),
  directives: { InfiniteScroll },
  router,
  store
});
