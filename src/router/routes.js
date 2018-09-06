const resolve = name =>
  () => import(
    /* webpackChunkName: 'views' */
    /* webpackMode: 'lazy-once' */
    `@/views/${name}.vue`
  );

export const routes = [
  {
    path: '/',
    name: 'main',
    component: resolve('main/index')
  },

  {
    path: '/crews',
    name: 'crews',
    component: resolve('crews/index')
  },

  {
    path: '/admin',
    component: resolve('Admin'),
    'children': [
      {
        path: '',
        component: resolve('admin/index')
      },

      {
        path: 'jobs',
        component: resolve('admin/jobs')
      },

      {
        path: 'crews',
        component: resolve('admin/crews')
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
  },

  {
    path: '*',
    name: 'error',
    component: resolve('Error')
  }
];
