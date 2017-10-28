import Vue from 'vue';
import VueRouter from 'vue-router';

import Main from './views/Main.vue';
import NotFoundComponent from './views/404.vue';
import Admin from './views/Admin.vue';

Vue.use(VueRouter);

function propsMain(r) {
  let { page, author, crew, type, mode, platform, maxpl } = r.query;
  return {
    page: Number(page) || 1,
    author: author || '',
    crew: crew || '',
    type: Number(type),
    mode: Number(mode),
    platform: Number(platform) || 1,
    maxpl: Number(maxpl)
  };
}

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Main, props: propsMain },
    { path: '/admin', component: Admin },
    { path: '*', component: NotFoundComponent }
  ]
});
