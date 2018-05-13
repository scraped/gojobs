const { jobDetailsPost } = require('./details');
const { jobListPost } = require('./list');
const { jobUploadPost } = require('./upload');
const { jobFetchPost, jobFetchExtendedPost } = require('./fetch');

module.exports = {
  jobDetailsPost,
  jobListPost,
  jobUploadPost,
  jobFetchPost,
  jobFetchExtendedPost
};
