import axios from 'axios';

const state = {
  jobnane: ''
};

const mutations = {
  setJobname(state, { jobname }) {
    state.jobname = jobname;
  }
};

const actions = {
  async getJobname({ commit }, payload) {
    const { jobname } = (await axios.get('/auth/jobname')).data;

    if (jobname) {
      commit('setJobname', { jobname });
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
