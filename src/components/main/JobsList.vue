<template>
  <div>
    <h1 class="title is-4">{{ jobsAmount }} jobs found</h1>

    <!-- <section class="section" v-if="jobsAmount">
      <pagination
        :short="true"
        :curr-page="page"
        :total-items="jobsAmount"></pagination>
    </section> -->

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
        :total-items="jobsAmount"></pagination>
    </div>
    <br>
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

  created() {
    this.fetchJobs();
  },

  watch: {
    '$route': 'fetchJobs'
  },

  methods: {
    fetchJobs() {
      this.$store.dispatch('fetchJobs');
    }
  },

  computed: {
    jobs() {
      return this.$store.state.jobs;
    },

    jobsAmount() {
      return this.$store.state.jobsAmount;
    },

    page() {
      return this.$store.state.page;
    }
  },
}
</script>

<style>

</style>
