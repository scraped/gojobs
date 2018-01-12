export default function generateStats(job) {
  if (!job.stats) return;

  const name = job.Metadata.name;
  const playTot = job.stats.pt;
  const playUnq = job.stats.pu;
  const quitUnq = job.stats.qu;
  const quitTot = job.stats.qt;
  const likes = job.ratings.rt_pos;
  const dislikesQuit = job.ratings.rt_neg;
  const dislikes = dislikesQuit - quitUnq;
  const bookmarked = job.ratings.bkmk_unq;

  const stats = {
    playTot, playUnq, quitTot, likes, dislikesQuit, dislikes, bookmarked
  };

  if (!checkBasicInfo(stats)) return;

}

function checkBasicInfo(stats) {
  const MIN_PLAYED_TIMES = 10;
  const MIN_PLAYED_USERS = 4;
  const MIN_LIKES = 3;

  const { playTot, playUnq, likes } = stats;

  if (playTot < MIN_PLAYED_TIMES
    || playUnq < MIN_PLAYED_USERS
    || likes < MIN_LIKES) return false;

  return true;
}
