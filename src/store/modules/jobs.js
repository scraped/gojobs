import { http } from 'src/utils';
import queryString from 'query-string';

const state = {
  jobs: [],
  number: 0
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
  async fetch({ commit }, { query }) {
    const queryStr = queryString.stringify(query);

    const response = await http.post(`/api/jobs?${queryStr}`);

    const { jobs, number } = response.data;

    commit('setJobs', { jobs });
    commit('setNumber', { number });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
