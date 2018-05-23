<template>
  <div>
    <div class="hero is-primary is-medium" style="background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent), url(https://media.rockstargames.com/rockstargames-newsite/uploads/d22704253e0132da7ddaec02a6ca7559aed835ba.jpg) 50% 50%;">
      <div class="hero-body">
        <div class="container">
          <h1 class="is-uppercase is-size-1" style="font-family: 'Oswald', sans-serif; font-weight: normal;">GTA Online Jobs</h1>
        </div>
      </div>
    </div>
    <section class="section">
      <div class="container">
        <!-- <h1 class="title">GTA Online Jobs</h1> -->
        <jobs-list></jobs-list>
        <br>
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
