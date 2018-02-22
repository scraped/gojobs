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

    const id = payload.id || '';

    const response = await Vue.http.post(`http://localhost:3000/api/jobs/id/${id}`);

    commit('set', { job: response.data });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
