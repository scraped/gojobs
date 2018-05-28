<template>
  <div>
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
    return store.dispatch('jobs/fetch', { query: route.query });
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
