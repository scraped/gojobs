import Vue from 'vue';

const state = {
  job: {}
};

const mutations = {
  set(state, { job }) {
    state.job = job;
  }
};

const actions = {
  async fetch({ commit }, payload) {
    if (!payload) payload = {};

    let id = payload.id || '';

    let response = await Vue.http.get(`/api/jobs/id/${id}`);
    commit('set', { job: response.data });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
