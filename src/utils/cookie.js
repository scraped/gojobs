const cookie = require('cookie');

export function serializeCookies(cookies) {
  return Object.keys(cookies).map(key => {
    return cookie.serialize(key, cookies[key]);
  }).join(';');
};
