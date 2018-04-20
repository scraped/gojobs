const { jobDetailsPost } = require('./details');
const { jobListPost } = require('./list');
const { jobUploadPost } = require('./upload');
const { jobFetchPost } = require('./fetch');

module.exports = {
  jobDetailsPost,
  jobListPost,
  jobUploadPost,
  jobFetchPost
};
