const main = require('./handlers/main.js');

module.exports = app => {
  app.get('/', getJobs)
}
