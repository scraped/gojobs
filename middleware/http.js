const axios = require('axios');
const cookie = require('cookie');

function serializeCookies(cookies) {
  return Object.keys(cookies)
    .map(key => {
      return cookie.serialize(key, cookies[key]);
    })
    .join(';');
}

module.exports = (req, res) => {
  const {hostname, app, cookies} = req;

  req.http = axios.create({
    baseURL: `http://${hostname}:${app.get('port')}/`,
    headers: {
      Cookie: serializeCookies(cookies),
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
};
