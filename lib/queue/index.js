const Queue = require('bull');

const fetchQueue = new Queue('Fetching stuff from RGSC');

fetchQueue.process('fetchJobBunches', './fetchJobBunchesProcessor');

module.exports = {
  fetchQueue
};
