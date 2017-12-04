<template>
  <div>
    <bulma-tabs>
      <li class="is-active"><a>Trending</a></li>
      <li><a>By rating</a></li>
      <li><a>Editor's choice</a></li>
      <li><a>Recently updated</a></li>
    </bulma-tabs>

    <div class="tags">
      <bulma-tag
        v-for="mode in modes"
        :key="mode.id">
        {{ mode.name }}
      </bulma-tag>
    </div>

    <h1 class="title is-4">{{ amount }} jobs found</h1>
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
        class="button is-large is-fullwidth"
        :class="{ 'is-loading': loading }"
        @click="fetch()">
        <span>Load more</span>
      </div>

      <template v-if="!pageInfLoading">
        <br>
        <pagination
          :curr-page="pageInfLoading || page"
          :total-items="amount"
          @load-more="fetch()">
        </pagination>
      </template>
    </div>
    <br>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import BulmaTag from '../BulmaTag.vue';
import BulmaTabs from '../BulmaTabs.vue';
import CardJob from '../CardJob.vue';
import Pagination from '../Pagination.vue';
import SearchJobs from './SearchJobs.vue';

export default {
  components: {
    BulmaTag,
    BulmaTabs,
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
    ...mapState({
      jobs: state => state.jobs.jobs,
      amount: state => state.jobs.amount,
      page: state => Number(state.route.query.page) || 1
    }),
    ...mapState({
      modes: state => state.common.modes,
      currMode: state => state.common.currMode
    }),
  },

  methods: {
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
