const {mongoose} = require('../lib/db');
const {Schema} = mongoose;

const schema = new Schema({
  jobId: {
    type: String,
    unique: true
  },

  desc: {
    type: String,
    trim: true,
    required: true
  },

  race: {
    laps: { type: Number },
    chp: { type: Number },
    dist: { type: Number },
    chpLocs: {
      type: [[Number]]
    },
    secChpLocs: {
      type: [[Number]]
    }
  }
}, {
  id: false
});

module.exports = mongoose.model('JobDetails', schema);
