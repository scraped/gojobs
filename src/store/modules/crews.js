import Vue from 'vue';

const currState = {
  crews: [],
};

const mutations = {
  set(state, {crews}) {
    state.crews = crews;
  },
};

const actions = {
  async fetch({commit}, {query}) {
    const response = await Vue.$http.post('/api/crews', query);

    const {crews} = response.data;

    commit('set', {crews});
  },
};

export default {
  namespaced: true,
  state: currState,
  mutations,
  actions,
};
