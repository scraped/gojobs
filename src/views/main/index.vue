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
          :loading="loading">
        </bulma-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import BulmaHero from 'src/components/BulmaHero.vue';
import JobsList from 'src/components/JobList.vue';
import BulmaPagination from 'src/components/BulmaPagination.vue';

export default {
  fetchData({ store, route }) {
    return store.dispatch('jobs/fetch', { query: route.query });
  },

  data() {
    return {
      loading: false
    };
  },

  components: {
    BulmaHero,
    JobsList,
    BulmaPagination
  },

  computed: {
    ...mapState('jobs', {
      amount: state => state.amount,
    }),
    ...mapState('route', {
      page: state => Number(state.query.page) || 1,
    })
  }
};
</script>
