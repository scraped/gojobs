const {mongoose} = require('../lib/db');

const {Schema} = mongoose;

function nonRockstar() {
  return !this.rockstar;
}

const schema = new Schema({
  crewId: {
    type: Number,
    unique: true,
    required: true
  },

  slug: {
    type: String,
    unique: true,
    required: true
  },

  rockstar: {
    type: Boolean
  },

  leader: {
    type: String,
    required: nonRockstar
  },

  name: {
    type: String,
    trim: true,
    required: true
  },

  desc: {
    type: String,
    trim: true
  },

  motto: {
    type: String,
    trim: true
  },

  tag: {
    type: String,
    uppercase: true,
    required: true
  },

  color: {
    type: String,
    set(color) {
      return color.substr(0, 6).toLowerCase();
    },
    required: nonRockstar
  },

  count: {
    type: Number,
    required: true
  },

  avatarId: {
    type: String
  },

  lastInfoFetch: {
    type: Date
  }
}, {
  id: false,
  toObject: {
    virtuals: true,
    versionKey: false
  }
});

// schema.virtual('avatarUrl')
//   .get(function() {
//     const {avatarId, crewId} = this;
//     return `https://prod.cloud.rockstargames.com/crews/sc/${avatarId}/${crewId}/publish/emblem/emblem_128.png`;
//   });

module.exports = mongoose.model('Crew', schema);
