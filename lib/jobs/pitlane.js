module.exports = {
  pitlaneAvailability
};

/**
 * Checks if pitlane is available in the current race.
 * Make sure that a "job" is a race.
 * @param {object} job RGSC job object [races only]
 * @returns {boolean} is there a pitlane
 */
function pitlaneAvailability(job) {
  const WRENCH_NAME = 'Vehicle - Health';

  const { type, loc } = job.Content.Metadata.data.mission.weap;

  let wrenches_number = 0;

  type.forEach(weapon => {
    if (weapon === WRENCH_NAME) {

    }
  });
}
