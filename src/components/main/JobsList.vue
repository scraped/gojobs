<template>
  <div>

    <div class="box">
    <h1 class="title is-4">{{ count }} jobs found on PC
    </h1>
    <div class="is-size-7">You can switch to <a>PS4</a> or <a>Xbox One</a>.</div>
    </div>

      <search-jobs
      :author="author"
      :crew="crew"
      :platform="platform"
      :type="type"
      :mode="mode"
      :maxpl="maxpl"></search-jobs>
    <loading-spinner v-if="loading"></loading-spinner>
    <div class="columns is-multiline" v-else>
      <template v-for="job in jobs">
        <div class="column is-one-third" :key="job.jobId">
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
import SearchJobs from './SearchJobs.vue';

export default {
  components: {
    LoadingSpinner,
    CardJob,
    Pagination,
    SearchJobs
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
