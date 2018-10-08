const random = require('lodash/random');
const bcrypt = require('bcrypt');
const {mongoose} = require('../lib/db');

const {Schema} = mongoose;

function isVerified() {
  return this.verified;
}

function setPassword(password) {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}

let schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Number,
      required: true,
      unique: true,
    },

    crewId: {
      type: Number,
    },

    verified: {
      type: Boolean,
      default: false,
      required: true,
    },

    verifyDate: {
      type: Date,
      required: isVerified,
    },

    password: {
      type: String,
      set: setPassword,
      required: isVerified,
    },

    email: {
      type: String,
    },
  },
  {
    id: false,
    toObject: {
      versionKey: false,
      virtuals: true,
    },
  },
);

schema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// static methods
schema.statics.generateTestJobName = function () {
  const values = 'abcdefghijklmnopqrstuvwxyz';
  const VALUES_NUMBER = values.length;
  const NAME_LENGTH = 18;

  let jobNameArray = [];

  for (let i = 0; i < NAME_LENGTH; i++) {
    jobNameArray[i] = values[random(0, VALUES_NUMBER - 1)];
  }

  return jobNameArray.join('');
};

module.exports = mongoose.model('User', schema);
