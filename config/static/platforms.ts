export type jobPlatforms = {
  [platformName: string]: {
    name: string;
    aliases?: Array<string>;
  }
}

export const platforms: jobPlatforms = {
  pc: {
    name: 'PC',
    aliases: ['pc']
  },

  ps4: {
    name: 'PS4',
    aliases: ['ps4', 'ps3']
  },

  xboxone: {
    name: 'Xbox One',
    aliases: ['xboxone', 'xbox']
  }
};

export const platformsEnum = Object.keys(platforms);
