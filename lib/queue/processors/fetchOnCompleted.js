module.exports = ({fetchQueue}) => (job, result) => {
  const {type} = job.data;

  if (type !== 'jobBunch') {
    return;
  }

  const {bunch} = result;

  if (!bunch.Missions) {
    return;
  }

  bunch.Missions.forEach(currJob => {
    const jobId = currJob.MissionId;
    fetchQueue.add(
      'fetch',
      {
        type: 'job',
        data: {
          jobId,
        },
      },
      {
        jobId,
      },
    );
  });
};
