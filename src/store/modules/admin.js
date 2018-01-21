import config from '../../../config';
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
      url = `${config.url}/api/tags?${queryStr}`;

    const response = await axios.get(url);

    const { tags } = response.data;

    commit('set', { tags });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
