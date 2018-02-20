const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  username: { type: String, required: true, unique: true },
  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  verified: { type: Boolean },
  password: { type: String, set: setPassword, required: isVerified }
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

schema.virtual('avatar')
  .get(function() {
    const username = this.username.toLowerCase();
    return {
      small: `https://a.rsg.sc/n/${username}/s`,
      large: `https://a.rsg.sc/n/${username}/l`
    }
  });

schema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

schema.methods.generateTestJobName = function() {
  const values = 'abcdefghijklmnopqrstuvwxyz',
    VALUES_NUMBER = values.length,
    NAME_MIN_LEN = 20,
    NAME_MAX_LEN = 30;

  const nameLength = _.random(NAME_MIN_LEN, NAME_MAX_LEN);

  let generatedString = new Array(nameLength);

  for (let i = 0; i < nameLength; i++) {
    generatedString[i] = values[_.random(0, VALUES_NUMBER - 1)];
  }

  return generatedString;
};

module.exports = mongoose.model('User', schema);
