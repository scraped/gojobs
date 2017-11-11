import './scss/main.scss'

import Vue from 'vue';
import VueResource from 'vue-resource';
import VueProgressBar from 'vue-progressbar';
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueResource);
// Vue.use(VueResourceProgressBarInterceptor);
Vue.use(VueProgressBar, {
  color: '#EB0000',
  failedColor: 'red',
});

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
});
