const moment = require('moment');

export function rgscRatingCssClass(rating) {
  if (rating >= 67) return 'is-success';
  if (rating >= 34) return 'is-warning';
  return 'is-danger';
}

export function updatedDate({ date, ver }) {
  const dateFromNow = moment(date).fromNow();

  if (ver === 1) {
    return `added ${dateFromNow}`;
  }
  return `${dateFromNow} (version ${ver})`;
};
