const jimp = require('jimp');
const palette = require('huey/palette');
const sharp = require('sharp');
const bluebird = require('bluebird');
const {jobTypes, vehClasses} = require('../../config/static');

bluebird.promisifyAll(jimp.prototype);

function getVehiclesClasses(rockstarVehicleClasses) {
  const vehClassesIds = Object.keys(vehClasses);

  const vehicleClasses = rockstarVehicleClasses.map(vehClass => {
    let classId;

    vehClassesIds.forEach(currClassId => {
      if (vehClasses[currClassId].name === vehClass) {
        classId = currClassId;
      }
    });

    return classId;
  });

  return vehicleClasses;
}

function secCheckpointsExist(sndchk) {
  for (let i = 0; i < sndchk.length; i++) {
    const { x, y } = sndchk[i];
    if (x !== 0 || y !== 0) {
      return true;
    }
  }

  return false;
}

function secondaryVehicles(raceInfo) {
  const {cptfrm, cptfrms, trfmvm} = raceInfo;

  const checkpointsTransformVehicles = [
    ...cptfrm,
    ...cptfrms
  ];

  let vehicles = [];

  checkpointsTransformVehicles.forEach(index => {
    if (index < 0) return;

    const vehicleId = String(trfmvm[index]);

    // Means "Base vehicle"
    if (vehicleId === "0") return;

    const alreadyExist = vehicles.includes(vehicleId);

    if (alreadyExist) return;

    vehicles.push(vehicleId);
  });

  return vehicles;
}

/**
 * Checks if a name of the job starts with non-english letters.
 * @param {object} rgscJob rgsc job object
 * @returns {boolean} true if it does
 */
function isNameBad({rgscJob}) {
  const {name} = rgscJob.Metadata;
  return /(\W|_)/.test(name[0]);
}

function getScTypeAndMode({rgscJob}) {
  let {
    type,
    mode
  } = rgscJob.Metadata.data.mission.gen;

  let scTypeName = type;
  let scModeName = mode;

  if (type === 'FreeMission') {
    if (mode === 'Last Team Standing' || mode === 'Capture') {
      scTypeName = mode;
    } else {
      scTypeName = 'Mission';
    }
  } else if (type === 'Survival') {
    scTypeName = 'Mission';
    scModeName = 'Survival';
  }

  let scTypeAndMode = {};

  Object.keys(jobTypes).forEach(type => {
    if (jobTypes[type].name === scTypeName) {
      scTypeAndMode.scType = type;
    }
  });

  const modes = jobTypes[scTypeAndMode.scType].modes;

  if (modes) {
    Object.keys(modes).forEach(mode => {
      if (modes[mode].name === scModeName) {
        scTypeAndMode.scMode = mode;
      }
    });
  }

  return scTypeAndMode;
}

/**
 * Checks if pitlane is available in the current race.
 * Make sure that a "job" is a race.
 * @param {object} rgscJob RGSC job object
 * @returns {boolean} is there a pitlane
 */
function pitlaneAvailability({ rgscJob }) {
  const WRENCH_NAME = 'Vehicle - Health';
  const WRENCH_MAX_DISTANCE = 40;
  const WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE = 4;
  const WRENCHES_NEAR_ANOTHER = WRENCHES_MIN_NEXT_TO_EACH_OTHER_FOR_PITLANE - 1;

  const {
    weap: weapons
  } = rgscJob.Metadata.data.mission;

  if (!weapons) {
    return false;
  }

  const {type, loc} = weapons;

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

async function getBackground({rgscJob}) {
  const {thumbnail} = rgscJob.Metadata;

  try {
    const initialImage = await jimp.read(thumbnail);

    const buffer = await initialImage.getBufferAsync(jimp.AUTO);

    const imagePng = await sharp(buffer).png().toBuffer();

    const image = await jimp.read(imagePng);

    let pixels = [];

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, i) => {
      pixels.push(
        image.bitmap.data[i + 0],
        image.bitmap.data[i + 1],
        image.bitmap.data[i + 2],
        image.bitmap.data[i + 3],
      );
    });

    const background = palette(pixels, 3).map(color => color.join(','));

    return background;
  } catch {
    return false;
  }
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

module.exports = {
  getVehiclesClasses,
  secCheckpointsExist,
  secondaryVehicles,
  isNameBad,
  getScTypeAndMode,
  pitlaneAvailability,
  getBackground
};
