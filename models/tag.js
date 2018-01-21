const mongoose = require('../lib/db');
const Schema = mongoose.Schema;

let schema = new Schema({
  name: { type: String, required: true, unique: true },
  shortname: { type: String, required: true, unique: true },
});

schema.set('id', false);

module.exports = mongoose.model('Tag', schema);
