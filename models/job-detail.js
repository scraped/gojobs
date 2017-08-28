const config = require('../config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const enumFlags = ['r_p2p', 'r_pitl', ''];

let jobDetailSchema = new Schema({
  jobId: { type: String, required: true, unique: true },

  images: { type: [String] },

  minplrs: { type: Number, required: true, min: 1, max: 30 },
  maxplrs: { type: Number, required: true, min: 1, max: 30 },
  // flags: { type: [String], enum: enumFlags },

  specific: {
    raceVehCl: { type: [Number] },
    raceDefaultVeh: { type: Number },
    raceDistance: { type: Number },
    raceCheckp: { type: Number },
    raceLaps: { type: Number },
    captureType: { type: Number, default: 0 },
    teamsAmount: { type: Number }
  },
});

module.exports = mongoose.model('JobDetail', jobDetailSchema, 'jobs-detailed');
