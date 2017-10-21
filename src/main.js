import './scss/main.scss'

import Vue from 'vue';
import App from './App.vue';
import router from './router';

import VueResource from 'vue-resource';
import VueBulmaComponents from 'vue-bulma-components';
// import VueProgressBar from 'vue-progressbar'
import NProgress from 'vue-nprogress';

Vue.use(VueResource);
Vue.use(VueBulmaComponents, {
  prefix: 'b-'
});
// Vue.use(VueProgressBar, {
//   color: '#EB0000',
//   failedColor: 'red'
// });

Vue.use(NProgress);
const nprogress = new NProgress({ parent: '.nprogress-container' });

new Vue({
  nprogress,
  el: '#app',
  render: h => h(App),
  router
});
