import { http } from '@/utils';

import {
  modes,
  platforms,
  vehClasses,
  vehicles
} from '@/../config/static';

const state = {
  job: null
};

const getters = {
  jobExt: state => (job = state.job) => {
    const {
      platform,
      scType,
      scMode,
      scAdded
    } = job;

    const platformName = platform
      ? platforms[platform - 1].name
      : '';

    const recentlyAdded = new Date() - scAdded <= 1000 * 60 * 60 * 24 * 14;

    const { name: scTypeName, icon: scTypeIcon } = modes[scType - 1];

    let typeAndModeNameAndIcon = {
      scTypeName,
      scTypeIcon,
    };

    if (scMode) {
      typeAndModeNameAndIcon.scModeName = modes[scType - 1].modes[scMode - 1];
      typeAndModeNameAndIcon.scModeIcon = modes[scType - 1].icons[scMode - 1];
    }

    return {
      ...job,
      ext: {
        platformName,
        recentlyAdded,
        ...typeAndModeNameAndIcon
      }
    };
  }
}

const mutations = {
  setJob(state, { job }) {
    state.job = job;
  }
};

const actions = {
  async fetchJob({ commit }, { id }) {

    const response = await http.post(`/api/job/${id}`);

    const { job } = response.data;

    commit('setJob', { job });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
