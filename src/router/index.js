import Vue from 'vue';
import VueRouter from 'vue-router';

const resolve = name => () => import(`@/views/${name}.vue`);

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: resolve('main/index')
  },

  {
    path: '/error/:code',
    name: 'error',
    component: resolve('Error')
  },

  {
    path: '/crews',
    name: 'crews',
    component: resolve('crews/index')
  },

  {
    path: '/admin',
    component: resolve('Admin'),
    children: [
      {
        path: '',
        component: resolve('admin/index')
      },

      {
        path: 'raw',
        component: resolve('admin/raw-jobs')
      },

      {
        path: 'fetch',
        component: resolve('admin/fetch')
      },

      {
        path: 'process',
        component: resolve('admin/process')
      }
    ]
  },

  {
    path: '/auth',
    name: 'auth',
    component: resolve('auth/index')
  },

  {
    path: '/job/:id/:slug',
    name: 'job',
    component: resolve('job/index')
  },

  {
    path: '/profile/:username',
    name: 'profile',
    component: resolve('profile/index')
  }
];

export function createRouter() {
  return new VueRouter({
    mode: 'history',

    scrollBehavior(to, from, savedPosition) {
      return savedPosition
        ? savedPosition
        : { x: 0, y: 0 };
    },

    linkExactActiveClass: 'is-active',

    routes
  });
}
