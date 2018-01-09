import axios from 'axios';
import queryString from 'query-string';

const state = () => {
  return {
    jobs: [],
    amount: 0
  };
};

const mutations = {
  set(state, { jobs, amount, append = false }) {
    if (append) {
      Reflect.apply(Array.prototype.push, state.jobs, jobs);
    } else {
      state.jobs = jobs;
    }
    state.amount = Number(amount) || 0;
  }
};

const actions = {
  async fetch({ commit }, payload) {
    let { query, append } = payload;
    if (append) query.page++;
    let queryStr = queryString.stringify(query);

    let response = await axios.get(`http://localhost:3000/api/jobs?${queryStr}`);

    let { jobs, amount } = response.data;

    commit('set', { jobs, amount, append });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
