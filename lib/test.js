const config = require('../config');

const mongoose = require('mongoose');
const JobRaw = require('../models/jobRaw.js');
const Crew = require('../models/Crew.js');
mongoose.connect(config.mongo.connectUri, config.mongo.options);

new Crew({
  crewId: 19208361,
  linkName: 'zachetka',
  abbr: 'ZARU',
  color: '000000',
  updated: new Date()
}).save();
