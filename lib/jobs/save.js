const RawJob = require('../../models/raw-job');
const _ = require('lodash');
const { diffObjects } = require('../helpers');

module.exports = {
  saveJobs
};

async function saveJobs({ jobs, extended }) {
  let failures = 0;
  let jobsToSavePromises = [];

  jobs.forEach(job => {
    jobsToSavePromises.push(
      saveRegularJob({ job, extended }).catch(err => err)
    );
  });

  const saveResults = await Promise.all(jobsToSavePromises);

  saveResults.forEach(({ failure }) => {
    if (failure) {
      failures++;
    }
  });

  return {
    failures
  };
}

async function saveRegularJob({ job, extended = false }) {
  try {
    const jobId = job.Content.Metadata.RootContentId;
    const jobCurrId = job.MissionId;

    let newRawJob = {
      jobId,
      jobCurrId,
      job: job.Content,
      fetchDate: new Date()
    };

    if (extended) {
      newRawJob.extended = extended;
    }

    const rawJob = await RawJob.findOne({ jobId });

    if (rawJob) {
      const differ = rawJob.job.Metadata.ver !== job.Content.Metadata.ver;



      rawJob.fetchPrevDate = rawJob.fetchDate;

      const statsDelta = {
        delta: diffObjects({
          oldObj: rawJob.job.stats,
          newObj: job.Content.stats
        }),
        date: new Date()
      };

      if (rawJob.uploaded) {
        newRawJob.statsDeltas = [statsDelta];
      } else {
        if (differ) {
          return false;
        }

        const { fetchDate } = rawJob;

        const statsDeltaOld = rawJob.statsDelta;

        if (statsDeltaOld && statsDeltaOld.length) {
          const latestStatsDelta = statsDeltaOld.reduce((prev, curr) => {
            return curr.date >= prev.date ? curr.date : prev.date;
          }, new Date(0));

          // eslint-disable-next-line
          if (latestStatsDelta - new Date() < 60 * 60 * 12) {
            return false;
          }
        }

        if (statsDelta.delta !== null) {
          newRawJob.$push = { statsDeltas: statsDelta };
        }
        newRawJob.extended = extended;
        newRawJob.uploaded = false;
      }
    } // if rawJob

    await RawJob.findOneAndUpdate(
      { jobId },
      newRawJob,
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.log('saveRegularJob error:', error);
    return false;
  }

  return true;
}
