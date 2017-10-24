import './scss/main.scss'

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import bus from './bus';

import VueResource from 'vue-resource';
import VueProgressBar from 'vue-progressbar';
import VueResourceProgressBarInterceptor from 'vue-resource-progressbar-interceptor';

Vue.use(VueResource);
Vue.use(VueProgressBar, {
  color: '#EB0000',
  failedColor: 'red',
});
Vue.use(VueResourceProgressBarInterceptor);

// Vue.http.interceptors.push(function(request, next) {
//   console.log('эмитнул старт')
//   bus.$emit('start-loading');
//   next(() => {
//     console.log('эмитнул финиш')
//     bus.$emit('finish-loading');
//   });
// });

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
