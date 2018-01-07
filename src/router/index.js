import Vue from 'vue';
import VueRouter from 'vue-router';

// const Main = () => import('@views/Main.vue');
// const NotFound = () => import('@views/404.vue');
import Main from '@views/Main.vue';
import NotFound from '@views/404.vue';
import Admin from '@views/Admin.vue';
import Login from '@views/Login.vue';
import Job from '@views/Job.vue';

Vue.use(VueRouter);

export function createRouter() {
  return new VueRouter({
    mode: 'history',

    scrollBehavior(to, from, savedPosition) {
      return savedPosition ? savedPosition : { x: 0, y: 0 };
    },

    routes: [
      { path: '/', name: 'main', component: Main },
      { path: '/admin', name: 'admin', component: Admin },
      { path: '/login', name: 'login', component: Login },
      { path: '/job/:id', name: 'job', component: Job },
      { path: '*', name: 'notfound', component: NotFound }
    ]
  });
};
