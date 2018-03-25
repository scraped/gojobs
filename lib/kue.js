const kue = require('kue');
const {fetchAndSave} = require('./jobs/fetch');

const queue = kue.createQueue();

queue.create('job', {}).save();

queue.process('job', async function (job, done) {
  try {
    await fetchAndSave({ limit: 10 });
    done();
    console.log('done!!!!!!!');
  } catch (error) {
    done(error);
  }
});
