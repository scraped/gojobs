const hours = h => 1000 * 60 * 60 * h;

module.exports = async queue => {
  const limit = 300;

  // const removedFailed = await queue.clean(hours(0.5), 'failed', limit);
  const removedCompleted = await queue.clean(hours(24), 'completed', limit);

  return {
    // removedFailed: removedFailed.length,
    removedCompleted: removedCompleted.length,
    limit,
  };
};
