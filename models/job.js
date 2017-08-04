const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = mongoose.model("Job", new Schema({
  jobID:    String,
  category: Number,
  name:     String,
  desc:     String,
  image:    String,
  platform: Number,

  info: {
    mode:       Number,
    submode:    Number,
    minlvl:     Number,
    minplayers: Number,
    maxplayers: Number,
  },

  details: Schema.Types.Mixed,

  creator: {
    nickname: String,
    medal:    Number,
    crew: {
      tag:  String,
      rank: Number,
      color: {
        type: String,
        default: "000000"
      }
    }
  },

  ratings: {
    playedTotal:  Number,
    playedUnique: Number,
    quitTotal:    Number,
    quitUnique:   Number,
    likes:        Number,
    dislikes:     Number,
    rating:       Number,
  },

  updated: {
    date:    Date,
    version: Number
  },
}));
