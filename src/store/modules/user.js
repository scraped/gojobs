import { axios } from 'src/helpers';

const state = {
  cookies: {},
  username: '',
  verified: false,
  jobname: '',
  email: '',
  date: null
};

const mutations = {
  setUsername(state, { username }) {
    state.username = username;
  },

  setJobname(state, { jobname }) {
    state.jobname = jobname;
  },

  setEmail(state, { email }) {
    state.email = email;
  },

  setVerifStatus(state, { verifStatus }) {
    state.verified = verifStatus;
  },

  setPreferences(state, { cookies }) {
    state.cookies = cookies;
  },

  setDate(state, { date }) {
    state.date = new Date(date);
  }
};

const actions = {
  async fetchUserInfo({ commit }) {
    const {
      username,
      jobname,
      verifStatus,
      date,
      email
    } = (await axios.post('/api/users/basicinfo')).data;

    if (username) commit('setJobname', { jobname });
    if (jobname) commit('setUsername', { username });
    if (verifStatus) commit('setVerifStatus', { verifStatus });
    if (date) commit('setDate', { date });
    if (email) commit('setEmail', { email });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
