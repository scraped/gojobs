const _get = require('lodash/get');
const {mongoose} = require('../lib/db');
const {Schema} = mongoose;
const modes = require('../config/static/modes');

const schema = new Schema({
  path: {
    type: String,
    validate: path => {
      return !!_get(modes, path);
    },
    // Just to point out that a tag without "path" field considered as global
    required: false
  },

  name: {
    type: String,
    unique: true
  },

  shortName: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model('JobTag', schema);
