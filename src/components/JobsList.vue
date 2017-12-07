<template>
  <div>
    <bulma-tabs>
      <li :class="{ 'is-active': !by }">
        <router-link :to="{ name: 'main' }">
          Trending
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'rating' }">
        <router-link :to="{ name: 'main', query: { by: 'rating' } }">
          By rating
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'featured' }">
        <router-link :to="{ name: 'main', query: { by: 'featured' } }">
          Featured
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'updated' }">
        <router-link :to="{ name: 'main', query: { by: 'updated' } }">
          Updated
        </router-link>
      </li>
      <li :class="{ 'is-active': by === 'newest' }">
        <router-link :to="{ name: 'main', query: { by: 'newest' } }">
          🔥 Newest
        </router-link>
      </li>
    </bulma-tabs>

    <div class="buttons">
      <router-link
        class="button is-small is-rounded"
        :class="{ 'is-primary': gameType === mode.id }"
        :to="{ name: 'main', query: { gameType: mode.id } }"
        v-for="mode in modes"
        :key="mode.id">
        {{ mode.name }}
      </router-link>
    </div>

    <h1 class="title is-4">{{ amount }} jobs found</h1>
    <p class="subtitle is-size-6 has-text-grey">
      Page {{ page }}
    </p>

    <div class="columns is-multiline">
      <div
        class="column is-one-third"
        v-for="job in jobs"
        :key="job.jobId">
        <job-card :job="job"></job-card>
      </div>
    </div>

    <br>
    <pagination
      :curr-page="page"
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
import genQuery from './mixins/gen-query.js';

import BulmaTag from './BulmaTag.vue';
import BulmaTabs from './BulmaTabs.vue';
import JobCard from './JobCard.vue';
import Pagination from './Pagination.vue';

export default {
  components: {
    BulmaTag,
    BulmaTabs,
    Pagination,
    JobCard,
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
    }),
    ...mapState('route', {
      page: state => Number(state.query.page) || 1,
      by: state => state.query.by,
      byId: state => state.query.byId,
      gameType: state => state.query.gameType
    }),
    ...mapState('common', {
      modes: state => state.modes,
      currMode: state => state.currMode
    }),
  },

  methods: {
    async infiniteLoading() {
      let nextPage = this.page;
      ++nextPage;
      this.loading = true;

      await this.$store.dispatch(
        'jobs/fetch',
        { query: { page: ++this.page }, append: true }
      );

      this.loading = false;
    }
  }
}
</script>
