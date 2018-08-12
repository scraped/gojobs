const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
  section: { type: String, required: true },
  value: { type: String, required: true },
}, {
  id: false
});

module.exports = mongoose.model('Tag', schema);
