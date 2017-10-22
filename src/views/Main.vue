<template>
  <section class="section">
  <b-container>
    <b-columns is-multiline>
      <template v-for="job in jobs">
        <b-column is-one-third-desktop is-half-tablet>
          <card-job :job-obj="job"></card-job>
        </b-column>
      </template>
    </b-columns>
  </b-container>
  </section>
</template>

<script>
import CardJob from '../components/CardJob.vue';

export default {
  components: {
    CardJob
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


