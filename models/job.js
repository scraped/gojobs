const _ = require('lodash');
const { platforms, modes } = require('../config/static');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  jobId: {
    type: String,
    unique: true
  },

  jobCurrId: {
    type: String,
    required: true
  },

  rockstar: {
    type: Boolean
  },

  star: {
    type: Boolean
  },

  bad: {
    type: Boolean
  },

  author: {
    type: String,
    required: notRockstar
  },

  name: {
    type: String,
    trim: true,
    required: true
  },

  slug: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  minPl: {
    type: Number
  },

  maxPl: {
    type: Number,
    set: setMaxPlayers,
    required: true
  },

  platform: {
    type: Number,
    required: notRockstar
  },

  scType: {
    type: Number,
    required: true
  },

  scMode: {
    type: Number
  },

  tags: {
    type: [String]
  },

  details: {
    type: Schema.Types.Mixed,
    ref: 'JobDetails',
    required: true
  },

  stats: {
    points: {
      type: Number,
      required: true
    },

    playTot: {
      type: Number,
      required: true
    },

    playUnq: {
      type: Number,
      required: true
    },

    quitTot: {
      type: Number,
      required: true
    },

    quitUnq: {
      type: Number,
      required: true
    },

    likes: {
      type: Number,
      required: true },

    dislikes: {
      type: Number,
      required: true
    },

    dislikesQuit: {
      type: Number,
      required: true
    },

    rating: {
      type: Number,
      required: true
    },

    ratingQuit: {
      type: Number,
      required: true
    },

    changeMp: {
      type: Number,
      default: 0
    }
  },

  ver: {
    type: Number,
    required: true
  },

  scAdded: {
    type: Date
  },

  scUpdated: {
    type: Date,
    required: true
  },

  fetched: {
    type: Date,
    required: true
  }
}, {
  id: false,
  toObject: {
    versionKey: false,
    virtuals: true
  }
});

schema.virtual('imageUrl')
  .set(function(url) {
    const str = url.split('/');
    this.image = `${str[5]}.${str[7]}`;
  })
  .get(function() {
    const img = this.image.split('.');
    const { jobCurrId } = this;
    return `https://prod.cloud.rockstargames.com/ugc/gta5mission/${img[0]}/${jobCurrId}/${img[1]}.jpg`;
  });

schema.virtual('scTypeAndModeName')
  .set(function({ scTypeName, scModeName }) {
    const typeId = 1 + _.findIndex(
      modes,
      type => type.name === scTypeName
    );

    this.scType = typeId;

    const currModes = modes[typeId - 1].modes;

    if (currModes) {
      const modeId = 1 + _.findIndex(
        currModes,
        mode => mode === scModeName
      );
      if (modeId) {
        this.scMode = modeId;
      }
    }
  });

schema.virtual('scTypeName')
  .get(function() {
    return modes[this.scType - 1].name;
  });

schema.virtual('scModeName')
  .get(function() {
    if (this.scMode) {
      return modes[this.scType - 1].modes[this.scMode - 1];
    }
  });

schema.virtual('scTypeIcon')
  .get(function() {
    return modes[this.scType - 1].icon;
  })

schema.virtual('scModeIcon')
  .get(function() {
    if (this.scMode) {
      const typeModes = modes[this.scType - 1].modes;
      if (typeModes) {
        return typeModes[this.scMode - 1].icon;
      }
    }
  });

schema.virtual('platformName')
  .set(function(scPlatformName) {
    const platformId = 1 + _.findIndex(
      platforms,
      plat => plat.sc === scPlatformName
    );
    if (platformId) {
      this.platform = platformId;
    }
  })
  .get(function() {
    if (this.platform) {
      return platforms[this.platform - 1].name;
    }
  });

function notRockstar() {
  return !this.rockstar;
}

function setMaxPlayers(n) {
  return _.clamp(n, 1, 30);
}

module.exports = mongoose.model('Job', schema);
