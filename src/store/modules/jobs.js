import Vue from 'vue';

const state = {
  jobs: [],
  amount: 0
};

const mutations = {
  set(state, { jobs, count, append = false }) {
    if (append) {
      Reflect.apply(Array.prototype.push, state.jobs, jobs);
    } else {
      state.jobs = jobs;
    }
    state.amount = Number(count || '');
  }
};

const actions = {
  async fetch({ commit }, payload) {
    if (!payload) payload = {};

    let page = payload.page || '';
    let append = payload.append;

    let response = await Vue.http.get(`/api/jobs?page=${page}`);
    let { jobs, count } = response.data;

    commit('set', { jobs, count, append });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
