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
      scAdded,
      players
    } = job;

    const imageParts = image.split('.');
    const imageUrl = `https://prod.cloud.rockstargames.com/ugc/gta5mission/${imageParts[0]}/${jobCurrId}/${imageParts[1]}.jpg`;

    const platformName = plat
      ? platforms[plat].name
      : '';

    const recentlyAdded = new Date() - scAdded <= 1000 * 60 * 60 * 24 * 14;

    let playersNumberText = '';

    if (players) {
      if (players.length === 1) {
        players.unshift(1);
      }

      if (players[0] === players[1]) {
        playersNumberText = `Only for ${players[0]} players`;
      } else {
        playersNumberText = `${players[0]}-${players[1]} players`;
      }
    }

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
      playersNumberText,
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

    const response = await http.post(`/api/jobs/${id}`);

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
