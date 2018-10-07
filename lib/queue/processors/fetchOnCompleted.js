module.exports = ({fetchQueue}) => (job, result) => {
  const {type} = job.data;

  if (type !== 'jobBunch') {
    return;
  }

  result.content.items.forEach(({id: jobId}) => {
    fetchQueue.add(
      'fetch',
      {
        type: 'job',
        data: {
          jobId,
        },
      },
      {
        jobId: `${jobId}_${new Date()}`,
      },
    );
  });
};
