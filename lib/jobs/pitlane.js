module.exports = {
  pitlaneAvailability
};

/**
 * Checks if pitlane is available in the current race.
 * Make sure that a "job" is a race.
 * @param {object} job RGSC job object (with or without Content property)
 * @returns {boolean} is there a pitlane
 */
function pitlaneAvailability(job) {
  const WRENCH_NAME = 'Vehicle - Health',
    WRENCH_MAX_DISTANCE = 40,
    WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE = 4,
    WRENCHES_NEAR_ANOTHER = WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE - 1;

  const { type, loc } = job.Content
    ? job.Content.Metadata.data.mission.weap
    : job.Metadata.data.mission.weap;

  let wrenchesNumber = 0;

  type.forEach((weapon, i) => {
    if (weapon !== WRENCH_NAME) return;

    let wrenchesNear = 0;

    loc.forEach((location, j) => {
      if (j === i || type[j] !== WRENCH_NAME) {
        return;
      }

      if (distanceBetweenPoints(loc[i], location) <= WRENCH_MAX_DISTANCE) {
        wrenchesNear++;
      }
    });

    if (wrenchesNear >= WRENCHES_NEAR_ANOTHER) {
      wrenchesNumber++;
    }
  });

  return wrenchesNumber >= WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE;
}

/**
 * Returns distance between two points on the Cartesian plane
 * @param {object} p1 point 1
 * @param {object} p2 point 2
 * @returns {float} distance between the points
 */
function distanceBetweenPoints(p1, p2) {
  const distance = Math.sqrt(
    (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
  );

  return distance;
}
