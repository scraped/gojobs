<template>
  <div>
    <h1 class="title is-4">{{ jobsAmount }} jobs found</h1>
    <p class="subtitle is-size-6 has-text-grey">Page {{ page }}</p>

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

  computed: {
    jobs() {
      return this.$store.state.jobs.jobs;
    },

    jobsAmount() {
      return this.$store.state.jobs.amount;
    },

    page() {
      return Number(this.$store.state.route.query.page) || 1;
    }
  },
}
</script>

<style>

</style>
