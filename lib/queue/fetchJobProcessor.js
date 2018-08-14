const {RgscHttpClient} = require('../jobs/http');

async function performJob(data) {
  const http = new RgscHttpClient();

  if (!http.generateHeaders()) {
    throw new Error('HTTP request cannot be performed');
  }




}

module.exports = job => {
  return performJob(job.data);
};
