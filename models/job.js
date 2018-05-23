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
      required: true
    },

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

    growthRate: {
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
  }
}, {
  id: false,
  toObject: {
    virtuals: true,
    versionKey: false
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

schema.virtual('scTypeAndModeId')
  .set(function({ scTypeName, scModeName }) {
    const typeId = 1 + _.findIndex(
      modes,
      type => type.name === scTypeName
    );

    this.scType = typeId;

    const typeModes = modes[typeId - 1].modes;

    if (typeModes) {
      const modeId = 1 + _.findIndex(
        typeModes,
        mode => mode === scModeName
      );
      if (modeId) {
        this.scMode = modeId;
      }
    }
  });

schema.virtual('platformName')
  .set(function(scPlatformName) {
    const platformId = 1 + _.findIndex(
      platforms,
      plat => plat.short === scPlatformName.toLowerCase()
    );
    if (platformId) {
      this.platform = platformId;
    }
  });

function notRockstar() {
  return !this.rockstar;
}

module.exports = mongoose.model('Job', schema);
