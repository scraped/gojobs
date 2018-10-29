const {mongoose} = require('../config/mongoose');
const {validate} = require('../validators');

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
    validate(value) {
      return validate('username', value);
    },
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
    maxlength: 64,
  },

  tag: {
    type: String,
    uppercase: true,
    minlength: 3,
    maxlength: 4,
    required: true,
  },

  color: {
    type: String,
    minlength: 6,
    maxlength: 6,
    lowercase: true,
    required: nonRockstar,
  },

  memberCount: {
    type: Number,
    min: 0,
    validate: Number.isInteger,
    required: true,
  },

  avatarId: {
    type: String,
    minlength: 4,
    maxlength: 4,
  },

  lastInfoFetch: {
    type: Date,
  },

  nextFetch: {
    type: Date,
    required: true,
  },
}, {
  id: false,
  toObject: {
    versionKey: false,
  },
});

module.exports = mongoose.model('Crew', schema);
