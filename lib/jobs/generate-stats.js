const MIN_PLAYED_TIMES = 15,
  MIN_PLAYED_USERS = 5,
  MIN_LIKES = 4,
  MIN_RATING_QUIT = 7,
  MIN_RATING = 15;

/**
 * Generates 'stats' object for rawJobs.
 * @param {object} rawJob rawJob job object.
 * @returns {object|undefined} undefined is returned when job
 * doesn't match the requirements (see const section in this file).
 */
exports.generateStats = function({ rawJob }) {
  if (!rawJob.stats) {
    return;
  }

  const name = rawJob.Metadata.name,
    playTot = rawJob.stats.pt,
    playUnq = rawJob.stats.pu,
    quitUnq = rawJob.stats.qu,
    quitTot = rawJob.stats.qt,
    // bookmarked = rawJob.ratings.bkmk_unq,
    likes = rawJob.ratings.rt_pos,
    dislikesQuit = rawJob.ratings.rt_neg,
    dislikes = dislikesQuit - quitUnq,
    ratingQuitPct = Math.round(likes / (likes + dislikesQuit) * 100),
    ratingQuit = ratingQuitPct / 100,
    ratingPct = Math.round(likes / (likes + dislikes) * 100),
    rating = ratingPct / 100;

   if (playTot < MIN_PLAYED_TIMES
    || playUnq < MIN_PLAYED_USERS
    || likes < MIN_LIKES
    || ratingQuitPct < MIN_RATING_QUIT
    || ratingPct < MIN_RATING) {
    return;
  }

  // let points = likes + bookmarked;
  let points = likes;

  const multipliers = [
    checkNameBeginning(name),
    checkName(name),
    checkLikes(likes),
    checkRating(rating),
    checkRating(ratingQuit),
    checkRatingDiff({ rating, ratingQuit }),
    checkPlayedDiff({ playTot, playUnq }),
    checkType(rawJob)
  ];

  multipliers.forEach(multiplier => {
    points *= (multiplier || 1);
  });

  points = Math.ceil(points);

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
    rating: ratingPct
  };
}

/**
 * Reduces the multiplier up to 1 according to the value.
 * @param {number} MP initial multiplier > 1
 * @param {number} value specific coefficient in [0; 1].
 * @returns {number} new multiplier.
 */
function variableMultiplier({ MP, value }) {
  const maxMultiplierReduce = MP - 1;

  return MP - maxMultiplierReduce * value;
}

function checkNameBeginning(name) {
  const multiplier = 25;

  if (name[0].match(/([^\w]|_)/)) return;

  return multiplier;
}

function checkName(name) {
  const MP = 1.1,
    nameLength = name.length;

  let capitalized = 0,
    capitalizedCoeff = 0,
    words = 1;

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
  const MP = 2,
    LIKES_SUPREMUM = 100000,
    lotOfLikesCoeff = Math.min(1, likes / LIKES_SUPREMUM);

  return variableMultiplier({ MP, value: lotOfLikesCoeff });
}

function checkRating(rating) {
  const MP = 1.3,
    reverseRating = 1 - rating;

  return variableMultiplier({ MP, value: reverseRating })
}

function checkRatingDiff({ rating, ratingQuit }) {
  const MP = 1.2,
    diff = rating - ratingQuit;

  return variableMultiplier({ MP, value: diff });
}

function checkPlayedDiff({ playTot, playUnq }) {
  const MP = 1.1,
    coeff = playUnq / playTot;

  return variableMultiplier({ MP, value: coeff });
}

function checkType(rawJob) {
  const MP = 1.2,
    MAX_PLAYERS = 30,
    type = rawJob.Metadata.data.mission.gen.type,
    players = rawJob.Metadata.data.mission.gen.num;

  if (type !== 'Race') return;

  const playersCoeff = 1 - players / MAX_PLAYERS;

  return variableMultiplier({ MP, value: playersCoeff });
}
