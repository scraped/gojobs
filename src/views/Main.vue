<template>
  <section class="section">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full is-one-quarter-desktop">
          <div class="title">Search</div>
        </div>
        <div class="column">
          <div class="columns is-multiline">
            <template v-for="job in jobs">
              <div class="column is-half" :key="job.jobId">
                <card-job :job-obj="job"></card-job>
              </div>
            </template>
          </div>

          <div class="hero is-dark">
            <div class="hero-body">
              <pagination :total-items="228"></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CardJob from '../components/CardJob.vue';
import Pagination from '../components/Pagination.vue';

export default {
  components: {
    CardJob,
    Pagination
  },

  data() {
    return {
      jobs: []
    };
  },

  created: function() {
    this.fetchJobs();
  },

  methods: {
    fetchJobs () {
      this.$http.get('/api/jobs')
        .then(response => {
          this.jobs = response.data.jobs;
          this.$Progress.finish();
        })
        .catch(error => {
          console.warn('Cannot get jobs', error);
          this.$Progress.fail();
        });
    }
  },
};
</script>

<style scoped>

</style>


