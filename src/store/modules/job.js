import {http} from '@/utils';

import {
  jobTypes,
  platforms
} from '@/../config/static';

const state = {
  job: null
};

const getters = {
  job: state => state.job,

  jobExt: state => (job = state.job) => {
    const {
      jobCurrId,
      image,
      plat,
      scType,
      scMode,
      scAdded
    } = job;

    const imageParts = image.split('.');
    const imageUrl = `https://prod.cloud.rockstargames.com/ugc/gta5mission/${imageParts[0]}/${jobCurrId}/${imageParts[1]}.jpg`;

    const platformName = plat
      ? platforms[plat].name
      : '';

    const recentlyAdded = new Date() - scAdded <= 1000 * 60 * 60 * 24 * 14;

    const {
      name: scTypeName,
      icon: scTypeIcon
    } = jobTypes[scType];

    let typeAndModeNameAndIcon = {
      scTypeName,
      scTypeIcon,
    };

    if (scMode) {
      typeAndModeNameAndIcon.scModeName = jobTypes[scType].modes[scMode].name;
      typeAndModeNameAndIcon.scModeIcon = jobTypes[scType].modes[scMode].icon;
    }

    return {
      imageUrl,
      platformName,
      recentlyAdded,
      ...typeAndModeNameAndIcon
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
