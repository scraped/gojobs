<template>
  <div>
    <section class="section">
      <pagination
        :curr-page="page"
        :short="true"
        :total-items="228"></pagination>
    </section>

    <div class="columns is-multiline">
      <template v-for="job in jobs">
        <div class="column is-half" :key="job.jobId">
          <card-job :job-obj="job"></card-job>
        </div>
      </template>
    </div>

    <section class="section">
      <pagination
        :curr-page="page"
        :total-items="228"></pagination>
    </section>
  </div>
</template>

<script>
import CardJob from '../components/CardJob.vue';
import Pagination from '../components/Pagination.vue';

export default {
  components: {
    CardJob,
    Pagination
  },

  data () {
    return {
      jobs: [],
      page: 1
    }
  },

  created () {
    this.fetchJobs(this.page);
  },

  watch: {
    '$route': 'fetchJobs'
  },

  methods: {
    fetchJobs() {
      this.page = Number(this.$route.query.page) || 1;
      this.jobs = [];

      this.$http.get(`/api/jobs?page=${this.page}`)
        .then(response => {
          this.jobs = response.data.jobs;
        })
        .catch(error => {
          console.warn('Cannot get jobs', error);
        });
    }
  }
}
</script>

<style>

</style>
