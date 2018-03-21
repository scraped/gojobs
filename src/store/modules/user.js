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
  },

  setVerifStatus(state, { verifStatus }) {
    state.verified = verifStatus;
  }
};

const actions = {
  async getUserInfo({ commit }) {
    const {
      username,
      jobname,
      verifStatus
    } = (await axios.post('/api/user/basicinfo')).data;

    if (username) commit('setJobname', { jobname });
    if (jobname) commit('setUsername', { username });
    if (verifStatus) commit('setVerifStatus', { verifStatus });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
