import { http } from '@/utils';

const state = {
  jobs: [],
  number: 0
};

const getters = {
  jobsFormatted({ jobs }, getters) {
    return jobs.map(job => getters.job.jobFormatted(job));
  }
};

const mutations = {
  setJobs(state, { jobs }) {
    state.jobs = jobs;
  },

  setNumber(state, { number }) {
    state.number = number;
  }
};

const actions = {
  async fetch({ commit, rootState: state }, query = {}) {
    try {
      const response = await http.post('/api/jobs', {
        ...state.route.query,
        ...query
      });

      const { jobs, number } = response.data;

      commit('setJobs', { jobs });
      commit('setNumber', { number });
    } catch (error) {
      console.log(error);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
