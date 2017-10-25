<template>
  <div>
    <section class="section">
      <pagination
        :curr-page="page"
        :short="true"
        :total-items="count"></pagination>
    </section>

    <loading-spinner v-if="loading"></loading-spinner>
    <div class="columns is-multiline" v-else>
      <template v-for="job in jobs">
        <div class="column is-half" :key="job.jobId">
          <card-job :job-obj="job"></card-job>
        </div>
      </template>
    </div>

    <section class="section">
      <pagination
        :curr-page="page"
        :total-items="count"></pagination>
    </section>
  </div>
</template>

<script>
import LoadingSpinner from '../components/Loading.vue';
import CardJob from '../components/CardJob.vue';
import Pagination from '../components/Pagination.vue';

export default {
  components: {
    LoadingSpinner,
    CardJob,
    Pagination
  },

  data () {
    return {
      count: 0,
      jobs: [],
      page: 1,
      loading: false
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
      let author = this.$route.query.author || '';
      this.page = Number(this.$route.query.page) || 1;
      this.loading = true;

      this.$http.get(`/api/jobs?page=${this.page}&author=${author}`)
        .then(response => {
          this.jobs = response.data.jobs;
          this.count = response.data.count;
          this.loading = false;
        })
        .catch(error => {
          console.warn('Cannot get jobs', error);
          this.loading = false;
        });
    }
  }
}
</script>

<style>

</style>
