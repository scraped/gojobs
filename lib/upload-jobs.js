const config = require('../config');
const modes = require('../config/modes');
const platforms = require('../config/platforms');
const _ = require('lodash');
const axios = require('axios');

const Job = require('../models/job');
const JobRaw = require('../models/job-raw');
const User = require('../models/user');
const Crew = require('../models/crew');

module.exports = uploadJobs;

async function uploadJobs() {
  let jobs = await JobRaw.find();

  if (!jobs) {
    throw new Error('Nothing to upload');
  }

  let uploadedJobs = await Promise.all(
    jobs.map(job => uploadJob(job).catch(err => err))
  );

  let errors = 0;

  uploadedJobs.forEach(job => {
    if (job instanceof Error) errors++;
  });

  return { errors };
}

async function uploadJob(job) {
  let newJob = generateJobBasicObj(job);

  if (!newJob) {
    throw new Error(`This job doesn't match the requirements.`);
  }

  let { jobId } = job;

  job = job.job;

  let username = job.Metadata.nickname;

  let userInfo = {
    username,
    updated: new Date()
  }

  let crewUrl = job.Metadata.crewurl;

  if (crewUrl) {
    crewUrl = crewUrl.split('/')[2];

    let crew = await Crew.findOne({ crewUrl });
    let crewId = '';

    if (crew) {
      crewId = crew._id;
    } else {
      let crewInfo = await fetchCrewInfo(crewUrl);
      let { crewId, name, avatar } = crewInfo;
      let tag = job.Metadata.crewtag;
      let color = job.Metadata.crewcolor.split('#')[1];

      let crew = await Crew.findOneAndUpdate(
        { crewUrl },
        { crewId, name, avatar, crewUrl, tag, color, dates: { updated: new Date() } },
        config.mongo.standardUpdateOptions
      );

    }

    userInfo.crew = crewId;
    newJob.crew = crewId;
  }

  let user = await User.findOneAndUpdate(
    { username },
    userInfo,
    config.mongo.standardUpdateOptions
  );

  newJob.author = user._id;

  let jobUploaded = await Job.findOneAndUpdate(
    { jobId },
    newJob,
    config.mongo.standardUpdateOptions
  );

  console.log(`${jobId} : ${jobUploaded ? 'updated' : 'added'}`);

  await JobRaw.findOneAndUpdate(
    { jobId },
    { uploaded: true },
    config.mongo.standardUpdateOptions
  );
}

async function fetchCrewInfo(crewUrl) {
  let link = `https://socialclub.rockstargames.com/crew/${crewUrl}`;

  let result = await axios.get(link);

  if (!result) {
    throw new Error('Cannot fetch crew info');
  }

  let response = result.data;

  let idAndAvatarMatch = response.match(/crews\/sc\/(\d+)\/(\d+)\/publish\//);
  let nameMatch = response.match(/\\"crewname\\":\\"([\w -]+)\\"/);

  return {
    crewId: idAndAvatarMatch[2],
    name: nameMatch[1],
    avatar: idAndAvatarMatch[1]
  }
}

function generateStats(job) {
  const MIN_PLAYED_TIMES = 10;
  const MIN_PLAYED_USERS = 4;
  const MIN_LIKES = 3;
  const MAGIC_CONST_FOR_POINTS_ALGORYTHM = 0.82;

  if (!job.stats) return;

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
    || playUnq < MIN_PLAYED_USERS
    || likes < MIN_LIKES) return;

  let ratingQuit = Math.round(likes / (likes + dislikesQuit) * 100);
  let rating = Math.round(likes / (likes + dislikes) * 100);

  let points = (likes + bookmarked)
    * Math.max(MAGIC_CONST_FOR_POINTS_ALGORYTHM, (1 - playUnq / playTot))
    * Math.max(MAGIC_CONST_FOR_POINTS_ALGORYTHM, (1 - likes / playTot))
    * (rating / 100)
    * (1 - (rating - ratingQuit) / 100)
    * 1000;

  // 1. If the name starts with non-english letters, decrease rating
  // significantly
  if (name[0].match(/[^\w]/)) {
    points *= 0.005;
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

  // 3. Decrease rating with a lot of likes
  let likesDecreaseCoeff = 1;
  if (likes > 100000) {
    likesDecreaseCoeff = 0.05;
  } else if (likes > 90000) {
    likesDecreaseCoeff = 0.1;
  } else if (likes > 80000) {
    likesDecreaseCoeff = 0.2;
  } else if (likes > 70000) {
    likesDecreaseCoeff = 0.3;
  } else if (likes > 50000) {
    likesDecreaseCoeff = 0.4;
  } else if (likes > 40000) {
    likesDecreaseCoeff = 0.5;
  } else if (likes > 30000) {
    likesDecreaseCoeff = 0.6;
  } else if (likes > 20000) {
    likesDecreaseCoeff = 0.7;
  } else if (likes > 10000) {
    likesDecreaseCoeff = 0.8;
  } else if (likes > 1000) {
    likesDecreaseCoeff = 0.9;
  } else if (likes > 500) {
    likesDecreaseCoeff = 0.96;
  } else if (likes > 100) {
    likesDecreaseCoeff = 0.98;
  }
  points *= likesDecreaseCoeff;

  // 4. Descrease rating if RGSC rating is average or bad
  let rgscRatingCoeff = 1, realRatingCoeff = 1;
  if (ratingQuit < 67) {
    rgscRatingCoeff = 0.75;
  } else if (ratingQuit < 34) {
    rgscRatingCoeff = 0.5;
  }
  if (rating < 67) {
    realRatingCoeff = 0.75;
  } else if (rating < 34) {
    realRatingCoeff = 0.5;
  }
  points *= (rgscRatingCoeff * realRatingCoeff);

  // 5. If it is not a race, decrease rating
  // or if race and < 30 players
  let miscDescreaseCoeff = 1;
  if (job.Metadata.data.mission.gen.type !== 'Race') {
    miscDescreaseCoeff = 0.6;
  } else {
    let maxpl = job.Metadata.data.mission.gen.num;
    if (maxpl < 10) {
      miscDescreaseCoeff = 0.6;
    } else if (maxpl < 16) {
      miscDescreaseCoeff = 0.7;
    } else if (maxpl < 30) {
      miscDescreaseCoeff = 0.8;
    }
  }
  points *= miscDescreaseCoeff;

  // 6. Decorate points
  points = Math.ceil(points);
  if (points < 500) return;
  points -= 500;

  return {
    points,
    playTot,
    playUnq,
    quitTot,
    quitUnq,
    likes,
    dislikes,
    dislikesQuit,
    rating,
    ratingQuit
  };
}

// Returns 0, if index was't found
function getPlatform(platform) {
  let index = _.findIndex(platforms, p => p.name === platform);
  return 1 + index;
}

function getCategory(type, mode) {
  let gameType = 0,
    gameMode = 0;

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

  return { gameType, gameMode };
}

function generateJobBasicObj(job) {
  let { jobId, jobCurrId } = job;
  let fetchDate = job.dates.fetch;

  job = job.job;

  let { name, desc } = job.Metadata;
  let platform = getPlatform(job.Metadata.plat);
  let image = job.Metadata.thumbnail;

  let { type, mode } = job.Metadata.data.mission.gen;
  let { gameType, gameMode } = getCategory(type, mode);

  let maxpl = job.Metadata.data.mission.gen.num;

  let stats = generateStats(job);

  let ver = job.Metadata.ver;
  let updated = job.Metadata.cdate;
  let fetch = fetchDate;

  if (!stats || !platform) return;

  let newJob = {
    jobId,
    jobCurrId,
    name,
    desc,
    platform,
    image,
    job: { gameType, gameMode, maxpl },
    stats,
    ver,
    dates: { fetch, updated }
  };

  if (ver === 1) {
    newJob.dates.added = updated;
  }

  return newJob;
}
