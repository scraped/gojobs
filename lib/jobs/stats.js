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
  const MIN_PLAYED_TIMES = 15;
  const MIN_PLAYED_USERS = 5;
  const MIN_LIKES = 4;
  const MIN_RATING_QUIT = 7;
  const MIN_RATING = 15;

  const rgscJob = rawJob.job;

  const { stats, Metadata, ratings } = rgscJob;

  if (!stats) {
    return;
  }

  const { name } = Metadata;

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

   if (playTot < MIN_PLAYED_TIMES
    || playUnq < MIN_PLAYED_USERS
    || likes < MIN_LIKES
    || ratingQuitPct < MIN_RATING_QUIT
    || ratingPct < MIN_RATING) {
    return;
  }

  let points = likes;

  const multipliers = [
    checkName(name),
    checkLikes(likes),
    checkRating(rating),
    checkRating(ratingQuit),
    checkRatingDiff({ rating, ratingQuit }),
    checkPlayedDiff({ playTot, playUnq }),
    checkType(rgscJob),
    checkVersionNumber(rgscJob)
  ];

  let totalMultiplier = 1;

  multipliers.forEach(multiplier => {
    totalMultiplier *= (multiplier || 1);
  });

  points = Math.ceil(points * totalMultiplier);

  const growth = (growthRate({ rawJob, oldJob }) * totalMultiplier).toFixed(10);

  return {
    points,
    playTot,
    playUnq,
    quitTot,
    quitUnq,
    likes,
    dislikesQuit,
    dislikes,
    ratingQuit: ratingQuitPct,
    rating: ratingPct,
    growth
  };
}

function growthRate({ rawJob, oldJob }) {
  const DAY = 1000 * 60 * 60 * 24;

  const rgscJob = rawJob.job;

  // if (!oldJob || !oldJob.fetchDate) {
  if (!oldJob) {
    return 1;
  }

  // using processDate is a temporary solution, because as of now not all jobs
  // have fetchDate property
  const previousFetchDate = oldJob.fetchDate || rawJob.processDate;
  const playedTotalNew = rgscJob.stats.pt;

  const daysPassed = Math.ceil((new Date() - previousFetchDate) / DAY);

  const growthPerDate = Math.ceil(
    (playedTotalNew - oldJob.stats.playTot) / daysPassed
  );

  return playedTotalNew / (playedTotalNew - growthPerDate);
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

function checkLikes(likes) {
  const MP = 2;

  const LIKES_SUPREMUM = 100000;

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
  const MP = 1.5;

  const MAX_VERSIONS = 100;

  const version = rgscJob.Metadata.ver;

  if (version >= MAX_VERSIONS) return;

  const coeff = 1 - version / MAX_VERSIONS;

  return variableMultiplier({ MP, value: coeff });
}
