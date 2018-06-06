const Job = require('../../models/job');
const RawJob = require('../../models/raw-job');
const JobDetails = require('../../models/job-details');

// module.exports = JobHandler;

class JobInfo {
  constructor(jobId) {
    this.jobId = jobId;
    this.job = null;
    this.rawJob = null;
    this.jobDetails = null;
    this.rgscJob = null;
    this.error = null;
  }

  static async fetchJobsBunch() {

  }

  async getInfo() {
    const { jobId } = this;

    try {
      this.job = await Job.findOne({ jobId });
      this.rawJob = await RawJob.findOne({ jobId });
      this.jobDetails = await JobDetails.findOne({ jobId });
    } catch (error) {
      this.error = error;
    }
  }

  async fetchRgscJob() {

  }

};
