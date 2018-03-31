import { http } from 'src/utils';
import queryString from 'query-string';

const state = {
  crews: []
};

const mutations = {
  set(state, { crews }) {
    state.crews = crews;
  }
};

const actions = {
  async fetch({ commit }, payload) {
    const queryStr = queryString.stringify(payload.query),
      url = `/api/crews?${queryStr}`;

    const response = await http.get(url);

    const { crews } = response.data;

    commit('set', { crews });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
