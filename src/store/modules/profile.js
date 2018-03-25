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
    const response = await axios.get(`/api/profiles/profile/${user}`);

    console.log('here!!!!!');

    const { username, crew } = response.data;

    console.log('crew:', crew);

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
