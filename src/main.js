import './scss/main.scss'

import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue'
import Admin from './views/Admin.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/admin', component: Admin }
  ]
})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
});