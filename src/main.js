import './scss/main.scss'

import Vue from 'vue';
import App from './App.vue';
import router from './router';

import vueBulmaComponents from 'vue-bulma-components';
import VueProgressBar from 'vue-progressbar'

Vue.use(vueBulmaComponents);
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '2px'
});

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
