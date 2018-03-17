import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import {
  jobs,
  job,
  crews,
  admin,
  auth
} from './modules';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function createStore() {
  return new Vuex.Store({
    strict: isDevelopment,
    modules: {
      jobs,
      job,
      crews,
      admin,
      auth
    }
  });
}
