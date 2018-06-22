const moment = require('moment');

const {
  modes,
  platforms,
  vehClasses,
  vehicles
} = require('../../config/static');

export function rgscRatingCssClass(rating) {
  if (rating >= 67) return 'success';
  if (rating >= 34) return 'warning';
  return 'danger';
}

export function updatedDate({ date, ver }) {
  const dateFromNow = moment(date).fromNow();

  if (ver === 1) {
    return `added ${dateFromNow}`;
  }
  return `${dateFromNow} (version ${ver})`;
};

export function scTypeModeIcon({ scType, scMode }) {
  const { name, icon } = modes[scType - 1];

  let scModeName = '';

  if (scMode) {
    scModeName = modes[scType - 1].modes[scMode - 1];
  }

  return {
    scTypeName: name,
    scTypeIcon: icon,
    scModeName
  };
}

export function scPlatformName({ platform }) {
  return {
    platformName: platform ? platforms[platform - 1].name : ''
  };
}
