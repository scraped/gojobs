const path = require('path');
const Queue = require('bull');
const chalk = require('chalk');

const resolve = name => path.resolve(__dirname, name);

const fetchQueue = new Queue('rgsc-fetch');

fetchQueue.process('fetchJobBunches', resolve('fetchJobBunchesProcessor.js'));
fetchQueue.process('fetchCrewInfo', resolve('fetchCrewInfoProcessor.js'));

fetchQueue
  .on('error', error => {
    console.log('error in queue:', error);
  })
  .on('active', job => {
    console.log(chalk.blue(`job ${job.name} has started`));
  })
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
  })
  .on('paused', () => {
    console.log('The queue had been paused');
  });

module.exports = {
  fetchQueue
};
