<template>
  <div>
    <h1 class="title is-4">{{ jobsAmount }} jobs found</h1>

    <div class="columns is-multiline">
      <template v-for="job in jobs">
        <div class="column is-one-third" :key="job.jobId">
          <card-job :job="job"></card-job>
        </div>
      </template>
    </div>

    <div class="box">
      <pagination
        :curr-page="page"
        :total-items="jobsAmount"
        @load-more="fetchJobs({ page: page + 1 })"></pagination>
    </div>
    <br>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../../store';

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

  beforeRouteEnter(to, from, next) {
    console.log('here')
    // let done = await store.dispatch('jobs/fetch');
    // next();
  },

  async beforeRouteUpdate() {
    console.log('beforerouteenter');
    let done = await store.dispatch('jobs/fetch');
    next();
  },

  computed: {
    jobs() {
      return this.$store.state.jobs.jobs;
    },

    jobsAmount() {
      return this.$store.state.jobs.amount;
    },

    page() {
      return this.$store.state.jobs.page;
    }
  },
}
</script>

<style>

</style>
