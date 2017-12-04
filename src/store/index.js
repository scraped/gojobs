import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import common from './modules/common';
import jobs from './modules/jobs';
import job from './modules/job';

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    common,
    jobs,
    job
  }
});
