const mongoose = require('../lib/db');
require('./user');
require('./job');
const Schema = mongoose.Schema;

let schema = new Schema({
  name: { type: String, required: true },
  desc: { type: String },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  jobs: { type: [Schema.Types.ObjectId], required: true, ref: 'Job' }
});

schema.set('toObject', {
  getters: true,
  versionKey: false
});

module.exports = mongoose.model(
  'JobsCollection',
  schema,
  'jobs-collections'
);
