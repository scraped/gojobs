import Vue from 'vue';

const currState = {
  tags: [],
};

const mutations = {
  set(state, {tags}) {
    state.tags = tags;
  },
};

const actions = {
  async fetch({commit}, payload) {
    const {tags} = (await Vue.$http({
      url: '/api/tags',
      params: payload.query,
    })).data;

    commit('set', {tags});
  },
};

export default {
  namespaced: true,
  state: currState,
  mutations,
  actions,
};
