import axios from 'axios';
import queryString from 'query-string';

const state = {
  jobs: [],
  amount: 0
};

const mutations = {
  set(state, { jobs, amount, append }) {
    if (append) {
      Reflect.apply(Array.prototype.push, state.jobs, jobs);
    } else {
      state.jobs = jobs;
    }
    state.amount = Number(amount) || 0;
  },

  // append(state, )
};

const actions = {
  async fetch({ commit }, { query, append }) {
    if (append) query.page++;
    const queryStr = queryString.stringify(query);

    const response = await axios.post(`http://localhost:3000/api/jobs?${queryStr}`);

    const { jobs, amount } = response.data;

    commit('set', { jobs, amount, append });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
