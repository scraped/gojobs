import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from './views/Main.vue';
import NotFoundComponent from './views/404.vue';
import Admin from './views/Admin.vue';
import Job from './views/Job.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',

  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? savedPosition : { x: 0, y: 0 };
  },

  routes: [
    { path: '/', name: 'main', component: Main },
    { path: '/admin', name: 'admin', component: Admin },
    { path: '/job/:id', name: 'job', component: Job },
    { path: '*', name: 'notfound', component: NotFoundComponent }
  ]
});
