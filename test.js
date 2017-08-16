const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.mongo.connectUri, config.mongo.options);
const JobModel = require('./models/job.js');
