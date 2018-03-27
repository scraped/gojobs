import {axios} from 'src/helpers';

const state = {
  job: {}
};

const mutations = {
  setJob(state, { job }) {
    state.job = job;
  }
};

const actions = {
  async fetchJob({ commit }, { id }) {

    const response = await axios.post(`/api/jobs/job/${id}`);

    const { job } = response.data;

    commit('setJob', { job });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
