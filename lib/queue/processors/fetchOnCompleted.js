module.exports = ({fetchQueue}) => {
  return (job, result) => {
    const {type, data} = job.data;

    if (type !== 'jobBunch') return;

    const {id, offset, category, platform} = data;
    const {fetchNextBunch, bunch} = result;

    if (!Object.keys(bunch).length) return;

    bunch.Missions.forEach(job => {
      const jobId = job.MissionId;
      fetchQueue.add(
        'fetch',
        {
          type: 'job',
          data: {
            jobId
          }
        },
        {
          jobId: jobId
        }
      );
    });

    if (fetchNextBunch) {
      const newOffset = (offset || 0) + bunch.Count;

      fetchQueue.add(
        'fetch',
        {
          type: 'jobBunch',
          data: {
            ...data,
            offset: newOffset
          }
        },
        {
          jobId: `bunch-${category}-${id}-${newOffset}-${platform}`
        }
      );
    }
  };
};
