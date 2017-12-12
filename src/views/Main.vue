<template>
  <div>
    <bulma-hero class="is-medium" text="GTA Online Jobs"></bulma-hero>

    <section class="section">
      <div class="container">
        <jobs-list></jobs-list>

        <br>
        <bulma-pagination
          :curr-page="page"
          :total-items="amount"
          :load-more-button="true"
          :loading="loading"
          @load-more="fetchAndAppend()">
        </bulma-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../store';
import { mapState } from 'vuex';

import BulmaHero from '@components/BulmaHero.vue';
import JobsList from '@components/JobsList.vue';
import BulmaPagination from '@components/BulmaPagination.vue';

async function fetchJobs(to, from, next) {
  await store.dispatch('jobs/fetch', { query: to.query });
  next();
}

export default {
  components: {
    BulmaHero,
    JobsList,
    BulmaPagination
  },

  data() {
    return {
      loading: false
    };
  },

  computed: {
    ...mapState('jobs', [
      'jobs',
      'amount'
    ]),
    ...mapState('route', {
      page: state => Number(state.query.page) || 1
    })
  },

  beforeRouteEnter: fetchJobs,

  beforeRouteUpdate: fetchJobs,

  methods: {
    async fetchAndAppend() {
      const { query } = this.$store.state.route;
      await store.dispatch('jobs/fetch', { query, append: true });
      this.$router.replace({ name: 'main', query: { page: this.page + 1 } })
    }
  }
};
</script>
