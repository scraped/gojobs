module.exports = function generateStats(job) {
  if (!job.stats) {
    return;
  }

  const MIN_PLAYED_TIMES = 10,
    MIN_PLAYED_USERS = 4,
    MIN_LIKES = 3;

  const name = job.Metadata.name,
    playTot = job.stats.pt,
    playUnq = job.stats.pu,
    quitUnq = job.stats.qu,
    quitTot = job.stats.qt,
    likes = job.ratings.rt_pos,
    dislikesQuit = job.ratings.rt_neg,
    dislikes = dislikesQuit - quitUnq,
    bookmarked = job.ratings.bkmk_unq,
    ratingQuit = Math.round(likes / (likes + dislikesQuit)),
    rating = Math.round(likes / (likes + dislikes)),
    ratingQuitPct = rating * 100,
    ratingPct = rating * 100;

   if (playTot < MIN_PLAYED_TIMES
    || playUnq < MIN_PLAYED_USERS
    || likes < MIN_LIKES) return;

  let points = likes + bookmarked;

  let multipliers = [
    checkNameBeginning(name),
    checkName(name),
    checkLikes(likes),
    checkRating(rating),
    checkRating(ratingQuit),
    checkRatingDiff({ rating, ratingQuit }),
    checkPlayedDiff({ playTot, playUnq }),
    checkType(job)
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

function variableMultiplier({ MP, value }) {
  const maxMultiplierReduce = MP - 1;

  return MP - maxMultiplierReduce * value;
}

function checkNameBeginning(name) {
  const multiplier = 5;

  if (name[0].match(/[^\w]/)) return;

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
  const MP = 1.5,
    LIKES_SUPREMUM = 100000,
    lotOfLikesCoeff = Math.min(1, likes / LIKES_SUPREMUM);

  return variableMultiplier({ MP, value: lotOfLikesCoeff });
}

function checkRating(rating) {
  const MP = 1.1,
    reverseRating = 1 - rating;

  return variableMultiplier({ MP, value: reverseRating })
}

function checkRatingDiff({ rating, ratingQuit }) {
  const MP = 1.1,
    diff = rating - ratingQuit;

  return variableMultiplier({ MP, value: diff });
}

function checkPlayedDiff({ playTot, playUnq }) {
  const MP = 1.1,
    coeff = playUnq / playTot;

  return variableMultiplier({ MP, value: coeff });
}

function checkType(job) {
  const MP = 1.2,
    MAX_PLAYERS = 30,
    type = job.Metadata.data.mission.gen.type,
    players = job.Metadata.data.mission.gen.num;

  if (type !== 'Race') return;

  const playersCoeff = 1 - players / MAX_PLAYERS;

  return variableMultiplier({ MP, value: playersCoeff });
}
