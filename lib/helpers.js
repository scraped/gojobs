const cookie = require('cookie');

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
