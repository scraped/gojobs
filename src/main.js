import './scss/main.scss'

import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueProgressBar from 'vue-progressbar';
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor';

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueProgressBar, {
  color: '#EB0000',
  failedColor: 'red',
});
Vue.use(VueResourceProgressBarInterceptor);

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
