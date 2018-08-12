const mongoose = require('mongoose');
const {Schema} = mongoose;

let schema = new Schema({
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
    required: notRockstar
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
    set: setColor,
    required: notRockstar
  },

  avatar: {
    type: String,
    required: notRockstar
  },

  lastInfoFetch: {
    type: Date,
    default: new Date()
  }
}, {
  id: false,
  toObject: {
    virtuals: true,
    versionKey: false
  }
});

schema.virtual('avatarUrl')
  .get(function() {
    const {avatar, crewId} = this;
    return `https://prod.cloud.rockstargames.com/crews/sc/${avatar}/${crewId}/publish/emblem/emblem_128.png`;
  });

function notRockstar() {
  return !this.rockstar;
}

function setColor(color) {
  return color.substr(0, 6).toLowerCase();
}

module.exports = mongoose.model('Crew', schema);
