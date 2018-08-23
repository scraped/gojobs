const isObject = require('lodash/isObject');

/**
 * Generates HTTP Cookie Header from the object.
 * @param {object} cookies cookies object.
 * @returns {string} HTTP Cookie Header.
 */
function serializeCookies(cookies) {
  return Object.keys(cookies)
    .map(key => {
      return key + '=' + cookies[key];
    })
    .join('; ');
};

/**
 * Finds a "difference" between two objects (works with nested properties
 * as well)
 * @param {object} oldObj "old" object
 * @param {object} newObj "new" object
 * @returns {object|null} returns the only properties that were changed
 * (with values from new object) or null if objects are the same.
 */
function diffObjects({
  oldObj = {},
  newObj = {}
}) {
  let diff = {};

  // We good with for..in because the order of array iteration
  // doesn't matter
  for (let prop in oldObj) {
    const oldValue = oldObj[prop];
    const newValue = newObj[prop];

    // Omit the current prop if values are the same and not objects
    // (object always are not equal to each other!)
    if (oldValue !== newValue) {
      if (isObject(oldValue) && isObject(newValue)) {
        const currDiff = diffObjects({
          oldObj: oldValue,
          newObj: newValue
        });
        if (currDiff) {
          diff[prop] = currDiff;
        }
      } else {
        diff[prop] = newValue;
      }
    }
  }

  for (let prop in newObj) {
    if (!Reflect.has(oldObj, prop)) {
      diff[prop] = newObj[prop];
    }
  }

  return Object.keys(diff).length
    ? diff
    : null;
}

module.exports = {
  serializeCookies,
  diffObjects
};
