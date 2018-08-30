const {stuntProps} = require('../../config/static');

/**
 * Generates 'stats' object for rgscJobs and checks if a job is "bad"
 * @param {object} rawJob raw job document
 * @returns {object|undefined} undefined is returned when job
 * doesn't match the requirements.
 */
function generateJobStats({rawJob, oldJob}) {
  const MIN_PLAYED_TIMES = 14;
  const MIN_PLAYED_USERS = 4;
  const MIN_LIKES = 4;
  const MIN_RATING_QUIT = 8;
  const MIN_RATING = 18;

  const rgscJob = rawJob.job;

  const {
    Metadata,
    stats,
    ratings
  } = rgscJob;

  if (!stats) {
    return;
  }

  const {
    name,
    desc,
    cat
  } = Metadata;

  const {
    pt: plTot,
    pu: plUnq,
    qu: quitUnq,
  } = stats;

  let {
    rt_pos: likes,
    rt_neg: dislikesQuit
  } = ratings;

  let dislikes = dislikesQuit - quitUnq;
  const ratingQuitPct = Math.round(likes / (likes + dislikesQuit) * 100);
  const ratingQuit = ratingQuitPct / 100;
  const ratingPct = Math.round(likes / (likes + dislikes) * 100);
  const rating = ratingPct / 100;

  const {type} = Metadata.data.mission.gen;

  // Survivals are broken in this regard
  if (type === 'Survival') {
    likes = 0;
    dislikes = 0;
    dislikesQuit = 0;
  }

  const rockstarJob = cat === 'rstar' || cat === 'verif';

  // We apply this constraints only for non-official jobs
  if (!rockstarJob
    && (plTot < MIN_PLAYED_TIMES
      || plUnq < MIN_PLAYED_USERS
      || likes < MIN_LIKES
      || ratingQuitPct < MIN_RATING_QUIT
      || ratingPct < MIN_RATING)) {
    return;
  }

  const growth = calcGrowthRate({rawJob, oldJob});

  const trendCoeffs = [
    growth,
    checkName(name),
    checkDescription(desc),
    checkLikes(likes),
    checkRating(rating),
    checkRating(ratingQuit),
    checkRatingDiff({rating, ratingQuit}),
    checkPlayedDiff({plTot, plUnq}),
    checkType(rgscJob),
    checkVersionNumber(rgscJob),
    checkProps(rgscJob),
    checkVersions(rawJob.versions)
  ].map(mp => mp || 1);

  const trend = trendCoeffs
    .reduce((prev, curr) => prev * curr, 1)
    .toFixed(12);

  return {
    trendCoeffs,

    stats: {
      trend,
      growth,
      plTot,
      plUnq,
      like: likes,
      dislike: dislikes,
      quit: quitUnq,
      rating: ratingPct,
      rstRating: ratingQuitPct,
    }
  };
}

function calcGrowthRate({rawJob, oldJob}) {
  const DAY = 1000 * 60 * 60 * 24;

  const rgscJob = rawJob.job;

  if (!oldJob || !oldJob.fetchDate) {
    return 1;
  }

  const fetchDatesDiff = rawJob.fetchDate - oldJob.fetchDate;

  if (!fetchDatesDiff) {
    return oldJob.stats.growth || 1;
  }

  const playedTotalNew = rgscJob.stats.pt;

  const growthPerDate = Math.ceil(
    (playedTotalNew - oldJob.stats.playTot) / Math.ceil(fetchDatesDiff / DAY)
  );

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
function variableMultiplier({MP, value}) {
  const maxMultiplierReduce = MP - 1;

  return MP - maxMultiplierReduce * value;
}

// *********************
// Checking functions
// *********************

const multipliers = {
  badName: 1.2,
  badDescription: 1.15,
  likes: 2,
  rating: 1.3,
  ratingDiff: 1.2,
  playedDiff: 1.1,
  type: 1.2,
  versionNumber: 1.6,
  props: 1.25,
  badUpdates: 1.9
};

function checkName(name) {
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

  // Every word can contain max one capital letter
  capitalized = Math.max(capitalized - words, 0);
  capitalizedCoeff = capitalized / nameLength;

  return variableMultiplier({
    mp: multipliers.badName,
    value: capitalizedCoeff
  });
}

function checkDescription(desc) {
  const ACCEPTABLE_DESC_LEN = 130;

  const descLength = desc.length;

  const coeff = descLength >= ACCEPTABLE_DESC_LEN
    ? 0
    : 1 - descLength / ACCEPTABLE_DESC_LEN;

  return variableMultiplier({
    mp: multipliers.badDescription,
    value: coeff
  });
}

function checkLikes(likes) {
  const LIKES_SUPREMUM = 50000;

  const lotOfLikesCoeff = Math.min(1, likes / LIKES_SUPREMUM);

  return variableMultiplier({
    mp: multipliers.likes,
    value: lotOfLikesCoeff
  });
}

function checkRating(rating) {
  const reverseRating = 1 - rating;

  return variableMultiplier({
    mp: multipliers.rating,
    value: reverseRating
  })
}

function checkRatingDiff({ rating, ratingQuit }) {
  const diff = rating - ratingQuit;

  return variableMultiplier({
    mp: multipliers.ratingDiff,
    value: diff
  });
}

function checkPlayedDiff({ playTot, playUnq }) {
  const coeff = playUnq / playTot;

  return variableMultiplier({
    mp: multipliers.playedDiff,
    value: coeff
  });
}

function checkType(rgscJob) {
  const MAX_PLAYERS = 30;

  const {type, num: players} = rgscJob.Metadata.data.mission.gen;

  if (type !== 'Race') return;

  const coeff = 1 - players / MAX_PLAYERS;

  return variableMultiplier({
    mp: multipliers.type,
    value: coeff
  });
}

function checkVersionNumber(rgscJob) {
  const MAX_VERSIONS = 200;

  const version = rgscJob.Metadata.ver;

  if (version >= MAX_VERSIONS) return;

  const coeff = version / MAX_VERSIONS;

  return variableMultiplier({
    mp: multipliers.versionNumber,
    value: coeff
  });
}

function checkProps(rgscJob) {
  const mp = multipliers.props;

  const {type, name: modeName} = rgscJob.Metadata.data.mission.gen;

  // Don't affect on other game modes
  if (type !== 'Race'
    || modeName === 'Land Race'
    || modeName === 'Water Race'
    || modeName === 'Air Race'
    || modeName === 'Bike Race') {
    return mp;
  }

  if (!rgscJob.Metadata.data.mission.prop) return;

  const propsNames = rgscJob.Metadata.data.mission.prop.model;

  let stuntPropsNumber = 0;

  propsNames.forEach(propName => {
    if (stuntProps.includes(propName)) {
      stuntPropsNumber++;
    }
  });

  const stuntPropsPercentage = stuntPropsNumber / propsNames.length;

  const coeff = 1 - stuntPropsPercentage;

  return variableMultiplier({
    mp,
    value: coeff
  });
}

function checkVersions(versions) {
  const updatesNumber = versions.length;

  let badUpdates = 0;

  versions.forEach(({chg: changed}) => {
    if (!changed) badUpdates++;
  });

  const coeff = badUpdates / updatesNumber;

  return variableMultiplier({
    mp: multipliers.badUpdates,
    value: coeff
  });
}

module.exports = {
  generateJobStats
};
