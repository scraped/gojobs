import { http } from '@/utils';

const state = {
  crews: []
};

const mutations = {
  set(state, { crews }) {
    state.crews = crews;
  }
};

const actions = {
  async fetch({ commit }, { query }) {
    const response = await http.post('/api/crews', query);

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
