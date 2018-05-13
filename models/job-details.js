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
      laps: { type: Number },
      chp: { type: Number },
      chpLocs: [{
        x: { type: Number },
        y: { type: Number }
      }],
      chpSecLocs: [{
        x: { type: Number },
        y: { type: Number }
      }],
      dist: { type: Number },
      vehDef: { type: Number }
    }
  }
}, {
  id: false
});

module.exports = mongoose.model('JobDetails', schema);
