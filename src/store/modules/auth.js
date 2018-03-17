import { axios } from 'src/helpers';

const state = {
  jobName: ''
};

const mutations = {
  setJobName(state, { job }) {
    state.jobName = job;
  }
};

const actions = {
  async getUserInfo({ commit }) {
    const { job } = (await axios.get('/auth/cookies')).data;

    if (job) {
      commit('setJobName', { job });
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
