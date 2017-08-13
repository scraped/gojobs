const mongoose = require('mongoose');
mongoose.connect('mongodb://andrew:qwerty@ds157521.mlab.com:57521/goj-jobs', {
  useMongoClient: true,
});
const Job = require('./models/job.js');

const getCategory = { 'none': 0, 'verif': 1, 'rstar': 2 };

function getJobType(type, mode) {
  switch (type) {
    case 'Race':                    return 1;
    case 'FreeMission':
      switch (mode) {
        case 'Versus Mission':
        case 'Adversary Mode':      return 2;
        case 'Capture':             return 3;
        case 'Last Team Standing':  return 4;
        default:                    return 0;
      }
    case 'Deathmatch':              return 5;
    case 'Survival':                return 6;
    case 'Parachuting':             return 7;
    default:                        return 0;
  }
}

function getJobSubtype(mode) {
  switch (mode) {
    case 'Special Vehicle Race':  return 11;
    case 'Stunt Race':            return 12;
    case 'Air Race':              return 13;
    case 'Bike Race':             return 14;
    case 'Land Race':             return 15;
    case 'Water Race':            return 16;
    case 'Versus Mission':        return 21;
    case 'Adversary Mode':        return 22;
    case 'Capture':               return 31;
    case 'Last Team Standing':    return 41;
    case 'Deathmatch':            return 51;
    case 'Team Deathmatch':       return 52;
    case 'Vehicle Deathmatch':    return 53;
    case 'Survival':              return 61;
    case 'Parachuting':           return 71;
    default:                      return 0;
  }
}

function getPlatform(platform, category) {
  if (category == 'verif' || category == 'rstar') return 0;
  return { 'PC': 1, 'Ps4': 2, 'XBoxOne': 3, 'Ps3': 4, 'XBox': 5 }[platform];
}

function getMedal(medal) {
  if (!medal) return 0;
  return { 'platinum': 1, 'gold': 2, 'silver': 3, 'bronze': 4 }[medal];
}

function getCrewColor(color) {
  if (!color) return '000000';
  return (color.length > 7) ? '000000' : color.split('#')[1];
}

// const jobs = require('./response/26-7-2017_22-29-0.json').Missions;
const jobs = require('./response-example.json').Missions;

jobs.forEach(job => {
  console.log('****** Processing a job:', job.Content.Metadata.name, '******');

  Job.find({ jobID: job.MissionId }, (err, response) => {
    if (err) {
      return console.log('!!! Error:', err);
    }

    if (response.length) {
      return console.log('!!! Already exists:', job.Content.Metadata.name);
    }

    new Job({
      jobID:    job.MissionId,
      category: getCategory[job.Content.Metadata.cat],
      name:     job.Content.Metadata.name,
      desc:     job.Content.Metadata.desc,
      image:    job.Content.Metadata.thumbnail,
      platform: getPlatform(job.Content.Metadata.plat),

      info: {
        mode:       getJobType(job.Content.Metadata.data.mission.gen.type,
                    job.Content.Metadata.data.mission.gen.mode),
        submode:    getJobSubtype(job.Content.Metadata.data.mission.gen.mode),
        minlvl:     job.Content.Metadata.data.mission.gen.rank,
        minplayers: job.Content.Metadata.data.mission.gen.min,
        maxplayers: job.Content.Metadata.data.mission.gen.num,
      },

      details: {},

      creator: {
        nickname: job.Content.Metadata.nickname,
        medal:    getMedal(job.Content.Metadata.creatorMedal),
        crew: {
          tag:  (job.Content.Metadata.crewtag)
                  ? job.Content.Metadata.crewtag.toUpperCase() : '',
          rank: job.Content.Metadata.crewrank,
          color: getCrewColor(job.Content.Metadata.crewcolor)
        }
      },

      ratings: {
        playedTotal:  (job.Content.stats) ? job.Content.stats.pt : 0,
        playedUnique: (job.Content.stats) ? job.Content.stats.pu : 0,
        quitTotal:    (job.Content.stats) ? job.Content.stats.qt : 0,
        quitUnique:   (job.Content.stats) ? job.Content.stats.qu : 0,
        likes:        (job.Content.ratings) ? job.Content.ratings.rt_pos : 0,
        dislikes:     (job.Content.ratings) ? job.Content.ratings.rt_neg : 0,
        rating:       (job.Content.ratings)
                        ? job.Content.ratings.avg.split('%')[0]
                        : 0,
      },

      updated: {
        date:    new Date(job.Content.Metadata.cdate),
        version: job.Content.Metadata.ver
      },
    }).save(err => console.log('!!! Saving failed:', err));
  });
});
