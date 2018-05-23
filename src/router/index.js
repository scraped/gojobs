import Vue from 'vue';
import VueRouter from 'vue-router';

const Main = () => import('@/views/main/index.vue');
const Crews = () => import('@/views/crews/index.vue');
const Admin = () => import('@/views/admin.vue');
const AdminIndex = () => import('@/views/admin/index.vue');
const AdminRawJobs = () => import('@/views/admin/raw-jobs.vue');
const AdminFetch = () => import('@/views/admin/fetch.vue');
const AdminProcess = () => import('@/views/admin/process.vue');
const Auth = () => import('@/views/auth/index.vue');
const Job = () => import('@/views/job/index.vue');
const Profile = () => import('@/views/profile/index.vue');

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

    linkExactActiveClass: 'is-active',

    routes
  })
};
