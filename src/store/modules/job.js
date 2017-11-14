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
  async fetch({ commit, rootState }) {
    let jobId = rootState.route.params.id;
    let response = await Vue.http.get(`/api/jobs/id/${jobId}`);
    commit('set', { job: response.data });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
