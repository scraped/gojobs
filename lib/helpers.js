/**
 * Generates HTTP Cookie Header from the object.
 * @param {object} cookies cookies object.
 * @returns {string} HTTP Cookie Header.
 */
function serializeCookies(cookies) {
  return Object.keys(cookies)
    .map(key => `${key}=${cookies[key]}`)
    .join('; ');
}

module.exports = {
  serializeCookies,
};
