import moment from 'moment';
import { http } from '@/utils';

import {
  modes,
  platforms,
  vehClasses,
  vehicles
} from '@/../config/static';

function scUpdatedRel(job) {
  const { scUpdated, ver } = job;
  const dateFromNow = moment(scUpdated).fromNow();

  const text = ver === 1
    ? `added ${dateFromNow}`
    : `${dateFromNow} (version ${ver})`;

  return {
    scUpdatedRel: text
  };
}

function scTypeModeIcon(job) {
  const { scType, scMode } = job;
  const { name, icon } = modes[scType - 1];

  let fields = {
    scTypeName: name,
    scTypeIcon: icon
  };

  if (scMode) {
    fields.scModeName = modes[scType - 1].modes[scMode - 1];
  }

  return fields;
}

function scPlatformName(job) {
  const { platform } = job;

  return {
    platformName: platform
      ? platforms[platform - 1].name
      : ''
  };
}

const state = {
  job: {}
};

const getters = {
  jobFormatted: state => (job = state.job) => {
    const { scUpdated } = job;

    return {
      ...job,
      ...scUpdatedRel(job),
      ...scTypeModeIcon(job),
      ...scPlatformName(job)
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
