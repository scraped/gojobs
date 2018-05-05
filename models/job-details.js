const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

const schema = new Schema({
  jobId: { type: String, unique: true },

  desc: { type: String, trim: true, required: true },

  crew: { type: Schema.Types.ObjectId, ref: 'Crew' },

  background: [{
    type: String,
  }],

  specific: {
    teamNum: { type: Number },
    race: {
      chp: { type: Number },
      chpLocs: { type: [Number] },
      dist: { type: Number },
      defVehId: { type: Number },
      p2p: { type: Boolean },
      laps: { type: Number }
    }
  }
}, {
  id: false
});

module.exports = mongoose.model('JobDetails', schema);
