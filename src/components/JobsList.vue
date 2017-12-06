<template>
  <div>
    <bulma-tabs>
      <li class="is-active"><a>Trending</a></li>
      <li><a>By rating</a></li>
      <li><a>Feautured</a></li>
      <li><a>Updated</a></li>
      <li><a>🔥 Newest</a></li>
    </bulma-tabs>

    <div class="buttons">
      <a
        class="button is-small is-rounded"
        v-for="mode in modes"
        :key="mode.id">
        {{ mode.name }}
      </a>
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

    <br>
    <pagination
      :curr-page="pageInfLoading || page"
      :total-items="amount"
      :load-more-button="true"
      :loading="loading"
      @load-more="infiniteLoading()">
    </pagination>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import BulmaTag from './BulmaTag.vue';
import BulmaTabs from './BulmaTabs.vue';
import CardJob from './CardJob.vue';
import Pagination from './Pagination.vue';

export default {
  components: {
    BulmaTag,
    BulmaTabs,
    Pagination,
    CardJob,
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
      page: state => Number(state.route.query.page) || 1,
      author: state => state.route.query.author
    }),
    ...mapState('common', {
      modes: state => state.modes,
      currMode: state => state.currMode
    }),
  },

  methods: {
    async infiniteLoading() {
      let nextPage = this.pageInfLoading || this.page;
      ++nextPage;
      this.loading = true;

      await this.$store.dispatch(
        'jobs/fetch',
        { query: { page: nextPage }, append: true }
      );

      this.pageInfLoading = nextPage;
      this.loading = false;
    }
  }
}
</script>
