<template>
  <div>
    <section class="hero is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Medium title
          </h1>
          <h2 class="subtitle">
            Medium subtitle
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <jobs-list></jobs-list>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="box">
          <custom-pagination
            :curr-page="page"
            :total-items="number"
            :load-more-button="true"
            :per-page="35"
            :loading="loading">
          </custom-pagination>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import JobsList from '@/components/JobList.vue';
import CustomPagination from '@/components/CustomPagination.vue';

export default {
  fetchData({ store, route }) {
    return store.dispatch('jobs/fetch', route.query);
  },

  data() {
    return {
      loading: false
    };
  },

  components: {
    JobsList,
    CustomPagination
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
