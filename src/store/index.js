import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  jobs: [],
  jobsAmount: 0,
  job: {},
  page: 1
};

const mutations = {
  setJobs(state, { jobs, count, page }) {
    state.jobs = jobs;
    state.jobsAmount = count;
    state.page = page;
  }
};

const actions = {
  async fetchJobs({ state, commit }) {
    let { page } = state.route.query || '';
    let response = await Vue.http.get(`/api/jobs?page=${page}`);
    let { jobs, count } = response.data;
    commit('setJobs', { jobs, count, page });
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions
});
