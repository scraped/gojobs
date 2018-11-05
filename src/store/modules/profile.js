import Vue from 'vue';

const currState = {
  user: null,
  crew: null,
};

const mutations = {
  setUser(state, {user}) {
    state.user = user;
  },

  setCrew(state, {crew}) {
    state.crew = crew;
  },
};

const actions = {
  async fetchUserInfo({commit}, {username}) {
    const response = await Vue.$http.get(`/api/profile/${username}`);

    const {user, crew} = response.data;

    if (user) {
      commit('setUser', {user});
    }

    if (crew) {
      commit('setCrew', {crew});
    }
  },
};

export default {
  namespaced: true,
  state: currState,
  mutations,
  actions,
};
