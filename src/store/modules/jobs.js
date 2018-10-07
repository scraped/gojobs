import {http} from '@/utils';

const state = {
  jobs: [],
  count: 0,
};

const mutations = {
  setJobs(state, {jobs, append}) {
    if (append) {
      state.jobs.push(...jobs);
    } else {
      state.jobs = jobs;
    }
  },

  setJobsCount(state, {count}) {
    state.count = count;
  },
};

const actions = {
  async fetch({commit}, query = {}) {
    const response = await http.post('/api/jobs', query);

    const {jobs, count} = response.data;
    const {append} = query;

    commit('setJobs', {jobs, append});
    commit('setJobsCount', {count});
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
