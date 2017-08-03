const mongoose = require("mongoose");

module.exports = mongoose.model("Jobs", mongoose.Schema({
  jobID:    String,
  name:     String,
  desc:     String,
  image:    String,
  gamemode: Number,
  platform: Number,

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
