import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import jobs from './modules/jobs';
import job from './modules/job';
import crews from './modules/crews';
import admin from './modules/admin';
import user from './modules/user';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function createStore() {
  return new Vuex.Store({
    strict: isDevelopment,
    modules: {
      jobs,
      job,
      crews,
      admin,
      user
    }
  });
}
