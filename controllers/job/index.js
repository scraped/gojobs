const {jobDetailsPost} = require('./details');
const {jobListPost, rawJobsListPost} = require('./list');
const {jobUploadPost} = require('./upload');
const {jobsFetchPost} = require('./fetch');

module.exports = {
  jobDetailsPost,
  jobListPost,
  rawJobsListPost,
  jobUploadPost,
  jobsFetchPost
};
