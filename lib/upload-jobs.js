const config = require('../config');
const modes = require('../config/modes');
const _ = require('lodash');

const Job = require('../models/job');
const JobRaw = require('../models/job-raw');
const User = require('../models/user');
const Crew = require('../models/crew');

module.exports = uploadJobs;

function generateStats(job) {
  const MIN_PLAYED_TIMES = 10;
  const MIN_PLAYED_PLAYERS = 4;
  const MIN_LIKES = 3;
  const MAGIC_CONST_FOR_POINTS_ALGORYTHM = 0.82;

  let name = job.Metadata.name;
  let playTot = job.stats.pt;
  let playUnq = job.stats.pu;
  let quitUnq = job.stats.qu;
  let quitTot = job.stats.qt;
  let likes = job.ratings.rt_pos;
  let dislikesQuit = job.ratings.rt_neg;
  let dislikes = dislikesQuit - quitUnq;
  let bookmarked = job.ratings.bkmk_unq;

  if (playTot < MIN_PLAYED_TIMES
    || playUnq < MIN_PLAYED_PLAYERS
    || likes < MIN_LIKES) return;

  let ratingQuit = Math.round(likes / (likes + dislikesQuit) * 100);
  let rating = Math.round(likes / (likes + dislikes) * 100);

  let points = (likes + bookmarked)
    * Math.max(MAGIC_CONST_FOR_POINTS_ALGORYTHM, (1 - playUnq / playTot))
    * Math.max(MAGIC_CONST_FOR_POINTS_ALGORYTHM, (1 - likes / playTot))
    * (rating / 100)
    * (1 - (rating - ratingQuit) / 100);

  // 1. If the name starts with non-english letters, decrease rating
  // significantly
  if (name[0].match(/[^\w]/)) {
    points *= 0.01;
  }

  // 2. The more capitalized letters are in the name, the less rating is
  let capitalized = 0, words = 1;
  let nameLength = name.length;
  for (let i = 0; i < nameLength; i++) {
    if (name[i].match(/\w/i) && name[i] === name[i].toUpperCase()) {
      capitalized++;
    }
    if (name[i] === ' ') words++;
  }
  capitalized = Math.max(capitalized - words, 0);
  points *= Math.max((1 - capitalized / nameLength), 0.5);

  // 3. If it is not a race, decrease rating
  if (job.Metadata.data.mission.gen.type !== 'Race') {
    points *= 0.8;
  }

  // 4. Decorate points
  points = Math.ceil(points * 100);
  if (points < 50) return;
  points -= 50;

  return {
    points: points,
    pldTot: playTot,
    pldUnq: playUnq,
    quitTot: quitTot,
    quitUnq: quitUnq,
    likes: likes,
    dislikes: dislikes,
    dislikesQuit: dislikesQuit,
    rating: rating,
    ratingQuit: ratingQuit
  }
}

function getPlatform(platform) {
  return 1 + _.findIndex(config.platforms, p => p.name === platform);
}

function getCategory(type, mode) {
  let gameType = 1, gameMode = 1;

  if (type === 'FreeMission') {
    if (mode === 'Adversary Mode' || mode === 'Versus Mission') {
      type = 'Mission';
    } else if (mode === 'Last Team Standing') {
      type = 'Last Team Standing';
    } else if (mode === 'Capture') {
      type = 'Capture';
    }
  }

  gameType = 1 + _.findIndex(modes, t => t.name === type);
  gameMode = 1 + _.findIndex(modes[gameType - 1].modes, m => m.name === mode);

  return {
    gameType,
    gameMode
  };
}

function parseRawJob(job) {
  let jobId = job.jobId;
  let jobCurrId = job.jobCurrId;
  job = job.job;

  let verif = job.Metadata.cat;
  let author = job.Metadata.nickname;
  let crewId = '';
  let { type, mode } = job.Metadata.data.mission.gen;
  let platform = job.Metadata.plat;

  if (!job.stats
    || verif === 'verif'
    || platform === 'Ps3'
    || platform === 'XBox') return;
  if (verif === 'none') verif = '';
  if (!author) author = 'rockstar';

  let stats = generateStats(job);
  if (!stats) return;
}

function uploadJobs() {
  JobRaw.find()
    .then(jobs => {
      jobs.forEach(job => {


        let crewUrl = job.Metadata.crewurl;
        let crewUpdatePromise = Promise.resolve();

        if (crewUrl) {
          crewUrl = crewUrl.split('/')[2];

          let crewInfo = {
            crewUrl: crewUrl,
            tag: job.Metadata.crewtag,
            color: job.Metadata.crewcolor.split('#')[1]
          };

          crewUpdatePromise = Crew.findOneAndUpdate(
            { crewUrl: crewUrl },
            crewInfo,
            config.mongo.standardUpdateOptions
          );
        }

        crewUpdatePromise
          .then(crew => {
            let userInfo = {
              username: author,
              medal: job.Metadata.creatorMedal,
              updated: new Date()
            }

            if (crew) {
              crewId = crew._id;
              userInfo.crew = crewId;
            }

            return User.findOneAndUpdate(
              { username: author },
              userInfo,
              config.mongo.standardUpdateOptions
            );
          })
          .then(user =>{
            if (!user) throw new Error('Cannot create user');
            let category = getCategory(type, mode);

            let newJob = {
              jobId: jobId,
              jobCurrId: jobCurrId,

              author: user._id,
              name: job.Metadata.name,
              desc: job.Metadata.desc,
              platform: getPlatform(platform),
              image: job.Metadata.thumbnail,

              job: {
                gameType: category.gameType,
                gameMode: category.gameMode,
                minpl: job.Metadata.data.mission.gen.min,
                maxpl: job.Metadata.data.mission.gen.num
              },

              stats: stats,

              updated: {
                ver: job.Metadata.ver,
                job: job.Metadata.cdate,
                info: new Date()
              }
            };

            if (crewId) newJob.crew = crewId;

            return Job.findOneAndUpdate(
              { jobId: jobId },
              newJob,
              config.mongo.standardUpdateOptions
            );
          })
          .then(job => {
            let text = job ? 'Raw job updated' : 'Raw job added';
            console.log(`${jobId} ${text}`);

            return JobRaw.update(
              { jobId: jobId },
              { uploaded: true }
            );
          })
          .then(jobRaw => {})
          .catch(err => {
            console.log(`Cannot add job to the database: ${err.message}`);
          });
      });
    });
}
