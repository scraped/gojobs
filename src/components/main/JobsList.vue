<template>
  <div>
    <pagination
      :curr-page="page"
      :short="true"
      :total-items="count"></pagination><br>

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
import LoadingSpinner from '../Loading.vue';
import CardJob from '../CardJob.vue';
import Pagination from '../Pagination.vue';

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
      loading: false
    }
  },

  props: [
    'page',
    'author',
    'crew',
    'type',
    'mode',
    'platform',
    'maxpl'
  ],

  created () {
    this.fetchJobs(this.page);
  },

  watch: {
    '$route': 'fetchJobs'
  },

  methods: {
    fetchJobs() {
      this.loading = true;

      this.$http.get(`/api/jobs?page=${this.page}&author=${this.author}&crew=${this.crew}&platform=${this.platform}&type=${this.type}&mode=${this.mode}&maxpl=${this.maxpl}`)
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
