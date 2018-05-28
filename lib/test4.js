const RawJob = require('../models/raw-job');
const fs = require('fs');
let vehicles = require('../config/static/vehicles');

(async () => {
  const jobs = await RawJob.find({ 'job.Metadata.data.mission.gen.mode': 'Transform Race' });

  let vehiclesNew = {};

  jobs.forEach(job => {
    const raceInfo = job.job.Metadata.data.mission.race;

    if (!raceInfo) {
      console.log(`no race info for ${job.jobId}`);
      return;
    }

    const { trfmvm, trfmvmn } = raceInfo;

    if (!trfmvm){
      console.log(`no trfmvn for ${job.jobId}`);
      return;
    }

    trfmvm.forEach((vehId, i) => {
      if (!vehicles[vehId] || vehicles[vehId] === '<Unknown>') {
        vehiclesNew[String(vehId)] = trfmvmn[i];
      }
    });
  });

  fs.writeFileSync('../config/static/vehiclesNew.json', JSON.stringify(vehiclesNew));

  console.log('saved');
  process.exit(0);
})();
