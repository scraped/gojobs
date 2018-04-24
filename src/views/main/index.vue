<template>
  <div>
    <div class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">GTA Online Jobs</h1>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <!-- <h1 class="title">GTA Online Jobs</h1> -->
        <div class="box">
        <jobs-list></jobs-list>
        </div>
        <br>
        <div class="box">
        <bulma-pagination
          :curr-page="page"
          :total-items="number"
          :load-more-button="true"
          :loading="loading">
        </bulma-pagination>
        </div>
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
    ...mapState('jobs', [
      'number'
    ]),
    ...mapState('route', {
      page: state => Number(state.query.page) || 1,
    })
  }
};
</script>
