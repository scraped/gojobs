const config = require('../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.connectUri, config.mongo.options);

mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

module.exports = mongoose;
