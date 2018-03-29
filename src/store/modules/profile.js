import {axios} from 'src/helpers';

const state = {
  username: '',
  crew: null
};

const mutations = {
  setUsername(state, { username }) {
    state.username = username;
  },

  setCrew(state, { crew }) {
    state.crew = crew;
  }
};

const actions = {
  async fetchUserInfo({ commit }, { user }) {
    const response = await this.$axios.get(`/api/profile/${user}`);

    const { username, crew } = response.data;

    if (username) {
      commit('setUsername', { username });
    }

    if (crew) {
      commit('setCrew', { crew });
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
