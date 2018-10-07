import {http} from '@/utils';

const state = {
  tags: [],
};

const mutations = {
  set(state, {tags}) {
    state.tags = tags;
  },
};

const actions = {
  async fetch({commit}, payload) {
    const queryStr = queryString.stringify(payload.query);

    const url = `/api/tags?${queryStr}`;

    const {tags} = (await http.get(url)).data;

    commit('set', {tags});
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
