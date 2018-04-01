const config = require('../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.connectUri, config.mongo.options);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', () => {
  console.log('Successfully connected to the DB');
});

module.exports = mongoose;
