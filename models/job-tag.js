const {mongoose} = require('../config/mongoose');
const {jobTypes} = require('../config/static');

const {Schema} = mongoose;

const schema = new Schema({
  mode: {
    type: String,
    validate(mode) {
      return Object.keys(jobTypes).includes(mode);
    },
    // Just to point out that a tag without a "mode" field considered as global
    required: false,
  },

  name: {
    type: String,
    unique: true,
  },

  shortName: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('JobTag', schema);
