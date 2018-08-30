const {mongoose} = require('../lib/db');
const _ = require('lodash');
const bcrypt = require('bcrypt');
require('./crew');

const {Schema} = mongoose;

let schema = new Schema({
  username: { type: String, required: true, unique: true },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  verified: { type: Boolean },
  verifyDate: { type: Date, required: isVerified },

  password: { type: String, set: setPassword, required: isVerified },
  email: { type: String }
}, {
  id: false,
  toObject: {
    versionKey: false,
    virtuals: true
  }
});

function isVerified() {
  return this.verified;
}

function setPassword(password) {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
}

schema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// static methods
schema.statics.generateTestJobName = function() {
  const values = 'abcdefghijklmnopqrstuvwxyz',
    VALUES_NUMBER = values.length,
    NAME_LENGTH = 18;

  let jobNameArray = [];

  for (let i = 0; i < NAME_LENGTH; i++) {
    jobNameArray[i] = values[_.random(0, VALUES_NUMBER - 1)];
  }

  return jobNameArray.join('');
};

module.exports = mongoose.model('User', schema);
