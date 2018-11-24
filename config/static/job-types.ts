export type jobType = {
  [jobType: string]: {
    name: string;
    icon: string;
    rockstar?: boolean;
    modes?: {
      [modeName: string]: {
        name: string;
        icon?: string;
      }
    }
  }
}

export const jobTypes: jobType = {
  race: {
    name: 'Race',
    icon: 'f17d',
    modes: {
      air: {
        name: 'Air Race',
        icon: 'f102'
      },

      water: {
        name: 'Water Race',
        icon: 'f1a5'
      },

      bike: {
        name: 'Bike Race',
        icon: 'f109'
      },

      land: {
        name: 'Land Race',
        icon: 'f168'
      },

      stunt: {
        name: 'Stunt Race',
        icon: 'e600'
      },

      spec: {
        name: 'Special Vehicle Race',
        icon: 'f123'
      },

      transf: {
        name: 'Transform Race',
        icon: 'e600'
      },

      target: {
        name: 'Target Assault Race',
        icon: 'e600'
      }
    }
  },

  dm: {
    name: 'Deathmatch',
    icon: 'f11e',
    modes: {
      team: {
        name: 'Team Deathmatch',
        icon: 'f197'
      },

      veh: {
        name: 'Vehicle Deathmatch',
        icon: 'f1a1'
      }
    }
  },

  lts: {
    name: 'Last Team Standing',
    icon: 'f16a'
  },

  capture: {
    name: 'Capture',
    icon: 'f113'
  },

  mission: {
    name: 'Mission',
    icon: 'f12f',
    rockstar: true,
    modes: {
      adv: {
        name: 'Adversary Mode'
      },

      versus: {
        name: 'Versus Mission'
      },

      surv: {
        name: 'Survival'
      },

      contact: {
        name: 'Contact Mission'
      }
    }
  },

  parachute: {
    name: 'Parachuting',
    icon: 'f107',
    rockstar: true
  }
};

export const jobTypesEnum = Object.keys(jobTypes);
