import { platforms, defaultPlatformId } from '../../../config/platforms';
import { modes } from '../../../config/modes';

const namespaced = true;

const state = {
  platforms,
  modes,

  currPlatform: defaultPlatformId,
  currMode: 0,
};

const getters = {
  currPlatform({ platforms, currPlatform }) {
    return platforms[currPlatform - 1];
  },

  currMode({ modes, currMode }) {
    return modes[currMode - 1];
  }
};

const mutations = {
  setPlatform(state, platformId) {
    state.currPlatform = platformId;
  },

  setMode(state, modeId) {
    state.currMode = modeId;
  }
};

export default {
  namespaced,
  state,
  getters,
  mutations
}
