const _ = require('lodash');
const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  username: { type: String, required: true },

  testJobName: { type: String, required: true }

});

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

module.exports = mongoose.model('UserNew', schema);
