<template>
  <div class="box">
    <h1 class="title is-4">{{ count }} jobs found</h1>

    <!-- <loading-spinner v-if="loading"></loading-spinner> -->
    <div class="columns is-multiline">
      <template v-for="job in jobs">
        <div class="column is-one-third" :key="job.jobId">
          <card-job :job-obj="job"></card-job>
        </div>
      </template>
    </div>

    <section class="section" v-if="count">
      <pagination
        :curr-page="page"
        :total-items="count"></pagination>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
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
    'jobs',
    'page',
    'author',
    'crew',
    'type',
    'mode',
    'platform',
    'maxpl'
  ],

  beforeRouteEnter (to, from, next) {
    this.fetchJobs(this.page);
    console.log('beforerouteenter');
    Vue.http.get(`/api/jobs?page=${to.query.page}`)
      .then(data => {
        next(vm => vm.setData(data));
      });
  },

  beforeRouteUpdate (to, from, next) {
    this.fetchJobs();
  },

  watch: {
    '$route': 'fetchJobs'
  },

  methods: {
    setData (response) {
      cosnole.log('setData');
      this.jobs = response.data.jobs;
      this.count = response.data.count;
    },

    fetchJobs() {
      // this.loading = true;

      return this.$http.get(`/api/jobs?page=${this.page}&author=${this.author}&crew=${this.crew}&platform=${this.platform}&type=${this.type}&mode=${this.mode}&maxpl=${this.maxpl}`)
      .then(response => {
          this.jobs = response.data.jobs;
          this.count = response.data.count;
          // this.loading = false;
        })
        .catch(error => {
          console.warn('Cannot get jobs', error);
          // this.loading = false;
        });

    }
  }
}
</script>

<style>

</style>
