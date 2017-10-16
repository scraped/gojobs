<template>
  <container>
    <columns is-multiline>
      <template v-for="job in jobs">
        <column is-one-third-desktop is-half-tablet>
          <card-job :job-obj="job"></card-job>
        </column>
      </template>
    </columns>
  </container>
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
    this.$http.get('/api/jobs')
      .then(jobs => {
        this.jobs = jobs.data;
      })
      .catch(error => {
        console.warn('Cannot get jobs', error);
      });
  }
};
</script>

<style scoped>

</style>


