import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import common from './modules/common';
import jobs from './modules/jobs';
import job from './modules/job';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function createStore() {
  return new Vuex.Store({
    strict: isDevelopment,
    modules: {
      common,
      jobs,
      job
    }
  });
}
