import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import jobs from './modules/jobs';
import job from './modules/job';

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    jobs,
    job
  }
});
