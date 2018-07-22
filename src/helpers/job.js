const moment = require('moment');

const {
  modes,
  platforms
} = require('../../config/static');

/**
 * @param {number} rating rating
 * @param {boolean} is prepend 'is-'?
 * @return {string} 'success', 'warning', or 'danger'
 */
export function ratingCssClass(rating = 0, is = true) {
  let ratingClass = 'danger';
  if (rating >= 34) ratingClass = 'warning';
  if (rating >= 67) ratingClass = 'success';

  return is ? 'is-' : ''
    + ratingClass;
}

export function updatedDate({ date, ver }) {
  const dateFromNow = moment(date).fromNow();

  if (ver === 1) {
    return `added ${dateFromNow}`;
  }
  return `${dateFromNow} (version ${ver})`;
}

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
