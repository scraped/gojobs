const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
  name: { type: String, required: true },
  desc: { type: String },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  jobs: { type: [Schema.Types.ObjectId], required: true, ref: 'Job' }
}, {
  id: false,
  toObject: {
    versionKey: false
  }
});

module.exports = mongoose.model('JobsCollection', schema);
