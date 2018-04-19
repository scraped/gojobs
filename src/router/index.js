import Vue from 'vue';
import VueRouter from 'vue-router';

const Main = () => import('src/views/main/index.vue');
const Crews = () => import('src/views/crews/index.vue');
const Admin = () => import('src/views/admin.vue');
const AdminIndex = () => import('src/views/admin/index.vue');
const AdminRawJobs = () => import('src/views/admin/raw-jobs.vue');
const AdminFetch = () => import('src/views/admin/fetch.vue');
const AdminProcess = () => import('src/views/admin/process.vue');
const Auth = () => import('src/views/auth/index.vue');
const Job = () => import('src/views/job/index.vue');
const Profile = () => import('src/views/profile/index.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main
  },

  {
    path: '/crews',
    name: 'crews',
    component: Crews
  },

  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: '',
        component: AdminIndex
      },

      {
        path: 'raw',
        component: AdminRawJobs
      },

      {
        path: 'fetch',
        component: AdminFetch
      },

      {
        path: 'process',
        component: AdminProcess
      }
    ]
  },

  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },

  {
    path: '/job/:id/:slug',
    name: 'job',
    component: Job
  },

  {
    path: '/profile/:username',
    name: 'profile',
    component: Profile
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

    linkActiveClass: 'is-active',

    routes
  })
};
