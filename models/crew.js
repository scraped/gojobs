const {mongoose} = require('../lib/db');

const {Schema} = mongoose;

function nonRockstar() {
  return !this.rockstar;
}

const schema = new Schema({
  crewId: {
    type: Number,
    unique: true,
    required: true,
  },

  slug: {
    type: String,
    unique: true,
    required: true,
  },

  rockstar: {
    type: Boolean,
  },

  leader: {
    type: String,
    required: nonRockstar,
  },

  name: {
    type: String,
    trim: true,
    required: true,
  },

  motto: {
    type: String,
    trim: true,
  },

  tag: {
    type: String,
    uppercase: true,
    required: true,
  },

  color: {
    type: String,
    validate(color) {
      return color.length === 6;
    },
    set(color) {
      return color.toLowerCase();
    },
    required: nonRockstar,
  },

  memberCount: {
    type: Number,
    validate(count) {
      return Number.isInteger(count) && count >= 0;
    },
    required: true,
  },

  avatarId: {
    type: String,
  },

  lastInfoFetch: {
    type: Date,
  },
}, {
  id: false,
});

// schema.virtual('avatarUrl')
//   .get(function() {
//     const {avatarId, crewId} = this;
//     return `https://prod.cloud.rockstargames.com/crews/sc/${avatarId}/${crewId}/publish/emblem/emblem_128.png`;
//   });

module.exports = mongoose.model('Crew', schema);
