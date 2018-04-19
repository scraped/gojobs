const cookie = require('cookie');
const _ = require('lodash');

/**
 * Generates HTTP Cookie Header from the object.
 * @param {object} cookies cookies object.
 * @returns {string} HTTP Cookie Header.
 */
exports.serializeCookies = cookies => {
  return Object.keys(cookies).map(key => {
    return cookie.serialize(key, cookies[key]);
  }).join(';');
};

/**
 * Finds a difference between two objects (works with nested properties as well,
 * also diffObject(a, b) gives the same result as diffObject(b, a);
 * @param {object} oldObj 1st object
 * @param {object} newObj 2nd object
 * @returns {object|null} returns the only properties that were changed and
 * null if objects are the same.
 */
exports.diffObjects = function diffObjects({ oldObj, newObj }) {
  let diff = {};

  // We good with for..in because the order of array iteration
  // doesn't matter
  for (let prop in oldObj) {
    const oldValue = oldObj[prop],
      newValue = newObj[prop];

    // Omit the current prop if values are the same and not objects
    // (object always are not equal to each other!)
    if (oldValue === newValue) return;

    if (_.isObject(oldValue) && _.isObject(newValue)) {
      const currDiff = diffObjects(oldValue, newValue);
      if (currDiff) {
        diff[prop] = currDiff;
      }
    } else {
      diff[prop] = newValue;
    }
  }

  for (let prop in newObj) {
    if (!Reflect.has(oldObj, prop)) {
      diff[prop] = newObj[prop];
    }
  }

  return Object.keys(diff).length ? diff : null;
}
