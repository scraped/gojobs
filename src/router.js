import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from './views/Main.vue';
import NotFoundComponent from './views/404.vue';
import Admin from './views/Admin.vue';
import JobsList from './components/JobsList.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Main},
    { path: '/admin', component: Admin },
    { path: '*', component: NotFoundComponent }
  ]
});
