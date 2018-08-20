const {RgscHttpClient} = require('../jobs/http');

async function performJob(data) {
  const http = new RgscHttpClient();

  try {
    await http.retrieveCredentialsFromDb();
  } catch (error) {
    try {
      
    } catch (error) {
      
    }
    
  }




}

module.exports = job => {
  return performJob(job.data);
};
