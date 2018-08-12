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

  background: [{
    type: String,
  }],

  specific: {
    teams: {
      type: Number
    },

    race: {
      laps: { type: Number },
      p2p: { type: Boolean },
      chp: { type: Number },
      chpLocs: {
        type: [[Number]]
      },
      chpSecLocs: {
        type: [[Number]]
      },
      dist: { type: Number },
      defVeh: { type: Number },
      trfVeh: [{ type: Number }]
    }
  }
}, {
  id: false
});

module.exports = mongoose.model('JobDetails', schema);
