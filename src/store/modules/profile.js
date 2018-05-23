import { http } from '@/utils';

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
    const response = await http.get(`/api/profile/${user}`);

    const { username, crew } = response.data;

    if (username) {
      commit('setUsername', { username });
    }

    if (crew) {
      commit('setCrew', { crew });
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
