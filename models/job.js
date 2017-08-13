const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let jobSchema = new Schema({
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
        default: '000000'
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
});

jobSchema.methods.getSubmodeName = function() {
  switch (this.info.submode) {
    case 11: return 'Special Vehicle Race';
    case 12: return 'Stunt Race';
    case 13: return 'Air Race';
    case 14: return 'Bike Race';
    case 15: return 'Land Race';
    case 16: return 'Water Race';
    case 21: return 'Versus Mission';
    case 22: return 'Adversary Mode';
    case 31: return 'Capture';
    case 41: return 'Last Team Standing';
    case 51: return 'Deathmatch';
    case 52: return 'Team Deathmatch';
    case 53: return 'Vehicle Deathmatch';
    case 61: return 'Survival';
    case 71: return 'Parachuting';
    case 0:  return 'Unknown';
  }
};

jobSchema.methods.getPlatformName = function() {
  switch (this.platform) {
    case 1: return 'PC';
    case 2: return 'PS4';
    case 3: return 'XB1';
    case 4: return 'PS3';
    case 5: return 'XB360';
  }
};

jobSchema.methods.getMedalColor = function() {
  switch (this.creator.medal) {
    case 0: return '#E0E0E0';
    case 1: return '#A4DDBC';
    case 2: return '#D4B362';
    case 3: return '#94979F';
    case 4: return '#B28060';
    default: return '#E0E0E0';
  }
}

jobSchema.methods.getRatingColor = function() {
  let rating = this.ratings.rating;

  return (rating >= 67) ? 'success' : (rating >= 34) ? 'warning' : 'danger';
};

jobSchema.methods.getDateString = function() {
  let date = this.updated.date;

  return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
};

module.exports = mongoose.model('Job', jobSchema);
