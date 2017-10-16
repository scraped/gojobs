import './scss/main.scss'

import Vue from 'vue';
import App from './App.vue';
import router from './router';

import VueResource from 'vue-resource';
import VueBulmaComponents from 'vue-bulma-components';
import VueProgressBar from 'vue-progressbar'

Vue.use(VueResource);
Vue.use(VueBulmaComponents);
Vue.use(VueProgressBar, {
  color: '#EB0000',
  failedColor: 'red'
});

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
