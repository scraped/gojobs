import axios from 'axios';

const state = {
  cookies: {}
};

const mutations = {
  setCookies(state, { cookies }) {
    state.cookies = cookies;
  }
};

const actions = {
  async getUserInfo({ commit }, payload) {
    const { cookies } = (await axios.get('http://localhost:3000/auth/cookies')).data;

    if (cookies) {
      commit('setCookies', { cookies });
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
