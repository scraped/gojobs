const path = require('path');
const Queue = require('bull');
const chalk = require('chalk');

const fetchQueue = new Queue('rgsc-fetch');

fetchQueue.process('fetchJobBunches', path.resolve(__dirname, 'fetchJobBunchesProcessor.js'));
fetchQueue.process('fetchCrewInfo', path.resolve(__dirname, 'fetchCrewInfoProcessor.js'));

fetchQueue
  .on('failed', (job, err) => {
    const {name, failedReason} = job;
    const data = JSON.stringify(job.data);
    console.log(chalk.red(`Job ${name} (data: ${data}) has failed with the following reason: ${failedReason}`));
  })
  .on('completed', (job, result) => {
    const {name} = job;
    console.log(chalk.green(`Job ${name} completed`));
  })
  .on('stalled', job => {
    const {name} = job;
    console.log(chalk.yellow(`Job ${name} stalled`));
  });

module.exports = {
  fetchQueue
};
