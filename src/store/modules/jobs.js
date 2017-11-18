import Vue from 'vue';

const state = {
  jobs: [],
  amount: 0
};

const mutations = {
  set(state, { jobs, count }) {
    // Reflect.apply(Array.prototype.push, state.jobs, jobs);
    state.jobs = jobs;
    state.amount = Number(count || '');
  }
};

const actions = {
  async fetch({ commit }, payload) {
    if (!payload) payload = {};

    let page = payload.page || '';

    let response = await Vue.http.get(`/api/jobs?page=${page}`);
    let { jobs, count } = response.data;
    commit('set', { jobs, count });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
