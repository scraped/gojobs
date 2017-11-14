import Vue from 'vue';

const state = {
  jobs: [],
  amount: 0,
  page: 1
};

const mutations = {
  set(state, { jobs, count, page }) {
    // Reflect.apply(Array.prototype.push, state.jobs, jobs);
    state.jobs = jobs;
    state.jobsAmount = Number(count || '');
    state.page = Number(page || '') || 1;
  }
};

const actions = {
  async fetch({ commit, rootState }, payload) {
    let page = rootState.route.query.page || 1;
    if (payload && payload.page) page = payload.page;
    let response = await Vue.http.get(`/api/jobs?page=${page}`);
    let { jobs, count } = response.data;
    commit('set', { jobs, count, page });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
