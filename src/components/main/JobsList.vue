<template>
  <div @scroll="onScroll()">
    <h1 class="title is-4">{{ jobsAmount }} jobs found</h1>
    <p class="subtitle is-size-6 has-text-grey">
      <template v-if="!pageInfLoading">
        Page {{ page }}
      </template>
      <template v-else>
        Pages {{ page }}-{{ pageInfLoading }}
      </template>
    </p>

    <div class="columns is-multiline">
      <div
        class="column is-one-third"
        v-for="job in jobs"
        :key="job.jobId">
        <card-job :job="job"></card-job>
      </div>
    </div>

    <div class="box">
      <div
        v-infinite-scroll="test"
        class="button is-large is-fullwidth"
        :class="{ 'is-loading': loading }"
        @click="fetch()">
        <span>Load more</span>
      </div>

      <template v-if="!pageInfLoading">
        <br>
        <pagination
          v-if="!pageInfLoading"
          :curr-page="pageInfLoading || page"
          :total-items="jobsAmount"
          @load-more="fetch()">
        </pagination>
      </template>
    </div>
    <br>
  </div>
</template>

<script>
import Vue from 'vue';

import CardJob from '../CardJob.vue';
import Pagination from '../Pagination.vue';
import SearchJobs from './SearchJobs.vue';

export default {
  components: {
    CardJob,
    Pagination,
    SearchJobs
  },

  data() {
    return {
      pageInfLoading: 0,
      loading: false
    };
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

  methods: {
    test() {
      console.log('Hello from test!');
    },

    async fetch() {
      let nextPage = this.pageInfLoading || this.page;
      ++nextPage;
      this.loading = true;

      await this.$store.dispatch(
        'jobs/fetch',
        { page: nextPage, append: true }
      );

      this.pageInfLoading = nextPage;
      this.loading = false;
    }
  }
}
</script>
