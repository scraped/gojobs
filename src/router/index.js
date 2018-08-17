import Vue from 'vue';
import VueRouter from 'vue-router';
import {routes} from './routes';

Vue.use(VueRouter);

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
