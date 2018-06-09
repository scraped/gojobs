const stuntProps = require('../../config/static/stunt-props');

module.exports = {
  generateStats
};

/**
 * Generates 'stats' object for rgscJobs and checks if a job is "bad"
 * @param {object} rawJob raw job document
 * @returns {object|undefined} undefined is returned when job
 * doesn't match the requirements.
 */
function generateStats({ rawJob, oldJob }) {
  const MIN_PLAYED_TIMES = 14;
  const MIN_PLAYED_USERS = 4;
  const MIN_LIKES = 4;
  const MIN_RATING_QUIT = 8;
  const MIN_RATING = 18;

  const rgscJob = rawJob.job;

  const { stats, Metadata, ratings } = rgscJob;

  if (!stats) {
    return;
  }

  const {
    name,
    desc,
    cat
  } = Metadata;

  const {
    pt: playTot,
    pu: playUnq,
    qt: quitTot,
    qu: quitUnq,
  } = stats;

  const {
    rt_pos: likes,
    rt_neg: dislikesQuit
  } = ratings;

  const dislikes = dislikesQuit - quitUnq;
  const ratingQuitPct = Math.round(likes / (likes + dislikesQuit) * 100);
  const ratingQuit = ratingQuitPct / 100;
  const ratingPct = Math.round(likes / (likes + dislikes) * 100);
  const rating = ratingPct / 100;

  const rockstarJob = cat === 'rstar' || cat === 'verif';

  // We apply this constraints only for non-official jobs
  if (!rockstarJob
    && (playTot < MIN_PLAYED_TIMES
      || playUnq < MIN_PLAYED_USERS
      || likes < MIN_LIKES
      || ratingQuitPct < MIN_RATING_QUIT
      || ratingPct < MIN_RATING)) {
    return;
  }

  const growth = calcGrowthRate({ rawJob, oldJob });

  const trend = [
      growth,
      checkName(name),
      checkDescription(desc),
      checkLikes(likes),
      checkRating(rating),
      checkRating(ratingQuit),
      checkRatingDiff({ rating, ratingQuit }),
      checkPlayedDiff({ playTot, playUnq }),
      checkType(rgscJob),
      checkVersionNumber(rgscJob),
      checkProps(rgscJob)
    ]
    .map(mp => mp || 1)
    .reduce((prev, curr) => prev * curr, 1)
    .toFixed(12);

  return {
    trend,
    growth,
    playTot,
    playUnq,
    likes,
    dislikesQuit,
    dislikes,
    ratingQuit: ratingQuitPct,
    rating: ratingPct
  };
}

function calcGrowthRate({ rawJob, oldJob }) {
  const DAY = 1000 * 60 * 60 * 24;

  const rgscJob = rawJob.job;

  // if (!oldJob || !oldJob.fetchDate) {
  if (!oldJob) {
    return 1;
  }

  // Using processDate is a temporary solution, because as of now not all jobs
  // have fetchDate property
  const oldFetchDate = oldJob.fetchDate || rawJob.processDate;
  const fetchDatesDiff = rawJob.fetchDate - oldFetchDate;

  if (!fetchDatesDiff) {
    return oldJob.stats.growth || 1;
  }

  const playedTotalNew = rgscJob.stats.pt;

  const growthPerDate = Math.ceil(
    (playedTotalNew - oldJob.stats.playTot) / Math.ceil(fetchDatesDiff / DAY)
  );

  console.log(`${rawJob.jobId} growth per date: ${growthPerDate}`)

  const actualGrowthRate = playedTotalNew / (playedTotalNew - growthPerDate);

  // This way we basically want coefficient to be more "significant"
  const growthRate = 1 + (actualGrowthRate - 1) * 2;

  return growthRate;
}

/**
 * Reduces the multiplier up to 1 according to the value.
 * @param {number} MP initial multiplier > 1
 * @param {number} value specific coefficient in [0; 1]. The more value is,
 * the more the reduction (i. e. 0 = no reduction, 1 = returns "1")
 * @returns {number} new multiplier
 */
function variableMultiplier({ MP, value }) {
  const maxMultiplierReduce = MP - 1;

  return MP - maxMultiplierReduce * value;
}

// *********************
// Checking functions
// *********************

function checkName(name) {
  const MP = 1.2;

  const nameLength = name.length;

  let capitalized = 0;
  let capitalizedCoeff = 0;
  let words = 1;

  for (let i = 0; i < nameLength; i++) {
    if (name[i].match(/\w/i)
      && name[i] === name[i].toUpperCase()) {
      capitalized++;
    }
    if (name[i] === ' ') words++;
  }

  // every word can contain max one capital letter
  capitalized = Math.max(capitalized - words, 0);
  capitalizedCoeff = capitalized / nameLength;

  return variableMultiplier({ MP, value: capitalizedCoeff });
}

function checkDescription(desc) {
  const MP = 1.15;

  const ACCEPTABLE_DESC_LEN = 130;

  const descLength = desc.length;

  const coeff = descLength >= ACCEPTABLE_DESC_LEN
    ? 0
    : 1 - descLength / ACCEPTABLE_DESC_LEN;

  return variableMultiplier({ MP, value: coeff });
}

function checkLikes(likes) {
  const MP = 2;

  const LIKES_SUPREMUM = 50000;

  const lotOfLikesCoeff = Math.min(1, likes / LIKES_SUPREMUM);

  return variableMultiplier({ MP, value: lotOfLikesCoeff });
}

function checkRating(rating) {
  const MP = 1.3;

  const reverseRating = 1 - rating;

  return variableMultiplier({ MP, value: reverseRating })
}

function checkRatingDiff({ rating, ratingQuit }) {
  const MP = 1.2;

  const diff = rating - ratingQuit;

  return variableMultiplier({ MP, value: diff });
}

function checkPlayedDiff({ playTot, playUnq }) {
  const MP = 1.1;

  const coeff = playUnq / playTot;

  return variableMultiplier({ MP, value: coeff });
}

function checkType(rgscJob) {
  const MP = 1.2;

  const MAX_PLAYERS = 30;

  const { type, num: players} = rgscJob.Metadata.data.mission.gen;

  if (type !== 'Race') return;

  const coeff = 1 - players / MAX_PLAYERS;

  return variableMultiplier({ MP, value: coeff });
}

function checkVersionNumber(rgscJob) {
  const MP = 1.6;

  const MAX_VERSIONS = 200;

  const version = rgscJob.Metadata.ver;

  if (version >= MAX_VERSIONS) return;

  const coeff = 1 - version / MAX_VERSIONS;

  return variableMultiplier({ MP, value: coeff });
}

function checkProps(rgscJob) {
  const MP = 1.25;

  const { type, name: modeName } = rgscJob.Metadata.data.mission.gen;

  // Don't affect on other game modes
  if (type !== 'Race'
    || modeName === 'Land Race'
    || modeName === 'Water Race'
    || modeName === 'Air Race'
    || modeName === 'Bike Race') {
    return MP;
  }

  const propsNames = rgscJob.Metadata.data.mission.prop.model;

  let stuntPropsNumber = 0;

  propsNames.forEach(propName => {
    if (stuntProps.includes(propName)) {
      stuntPropsNumber++;
    }
  });

  const stuntPropsPercentage = stuntPropsNumber / propsNames.length;

  const coeff = 1 - stuntPropsPercentage;

  return variableMultiplier({ MP, value: coeff });
}
