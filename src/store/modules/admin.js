import axios from 'axios';
import queryString from 'query-string';

const state = {
  tags: []
};

const mutations = {
  set(state, { tags }) {
    state.tags = tags;
  }
};

const actions = {
  async fetch({ commit }, payload) {
    const queryStr = queryString.stringify(payload.query),
      url = `/api/tags?${queryStr}`;

    const { tags } = (await axios.get(url)).data;

    commit('set', { tags });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
