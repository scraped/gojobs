import { http } from 'src/utils';

const state = {
  job: {}
};

const mutations = {
  setJob(state, { job }) {
    state.job = job;
  }
};

const actions = {
  async fetchJob({ commit }, { id }) {

    const response = await http.post(`/api/job/${id}`);

    const { job } = response.data;

    commit('setJob', { job });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
