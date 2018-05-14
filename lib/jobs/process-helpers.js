module.exports = {
  isNameBad,
  pitlaneAvailability
};

/**
 * Checks if a name of the job starts with non-english letters.
 * @param {object} rgscJob rgsc job object
 * @returns {boolean} true if it does
 */
function isNameBad(rgscJob) {
  const name = rgscJob.Metadata.name;
  return name[0].match(/([^\w]|_)/);
}

/**
 * Checks if pitlane is available in the current race.
 * Make sure that a "job" is a race.
 * @param {object} rgscJob RGSC job object
 * @returns {boolean} is there a pitlane
 */
function pitlaneAvailability(rgscJob) {
  const WRENCH_NAME = 'Vehicle - Health',
    WRENCH_MAX_DISTANCE = 40,
    WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE = 4,
    WRENCHES_NEAR_ANOTHER = WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE - 1;

  // const { type, loc } = rgscJob.Content
  //   ? rgscJob.Content.Metadata.data.mission.weap
  //   : rgscJob.Metadata.data.mission.weap;

  const { type, loc } = rgscJob.Metadata.data.mission.weap;

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
