import Vue from 'vue';

const state = {
  jobs: [],
  amount: 0
};

const mutations = {
  set(state, { jobs, amount, append = false }) {
    if (append) {
      Reflect.apply(Array.prototype.push, state.jobs, jobs);
    } else {
      state.jobs = jobs;
    }
    state.amount = Number(amount) || 0;
  }
};

const actions = {
  async fetch({ commit }, payload) {
    if (!payload) payload = {};

    let { page, append } = payload;
    page = page || '';

    let response = await Vue.http.get(`/api/jobs?page=${page}`);
    let { jobs, amount } = response.data;

    commit('set', { jobs, amount, append });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
