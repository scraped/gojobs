import {axios} from 'src/helpers';

const state = {
  username: ''
};

const mutations = {
  setUsername(state, { username }) {
    state.username = username;
  }
};

const actions = {
  async fetchUserInfo({ commit }, { user }) {
    const response = await axios.get(`/api/profiles/profile/${user}`);

    const { username } = response.data;

    if (username) {
      commit('setUsername', { username });
    }
  }
};

const getters = {
  avatarSmall(state) {
    const username = state.username.toLowerCase();
    return `https://a.rsg.sc/n/${username}/s`;
  },

  avatarLarge(state) {
    const username = state.username.toLowerCase();
    return `https://a.rsg.sc/n/${username}/l`;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
