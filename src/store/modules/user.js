import { axios } from 'src/helpers';

const state = {
  username: '',
  verified: false,
  jobname: ''
};

const mutations = {
  setUsername(state, { username }) {
    state.username = username;
  },

  setJobname(state, { jobname }) {
    state.jobname = jobname;
  }
};

const actions = {
  async getUserInfo({ commit }) {
    const { username, jobname } = (await axios.get('/auth/cookies')).data;

    if (jobname) commit('setJobname', { jobname });
    if (username) commit('setUsername', { username });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
