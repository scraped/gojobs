<template>
  <div>
    <!-- <section class="hero is-fullheight is-dark hero__welcome" style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6)), url('https://media.rockstargames.com/rockstargames-newsite/uploads/25d22aa4973a9a13d94c5df860eb6ecc1ba86021.jpg') 50% 50%;">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            GTA Online Jobs, Events & Playlists
          </h1>
          <p class="is-size-4">
            Constantly updated list of 10k+ GTA Online Jobs.<br>
            Easily find the best ones, create playlists, organize & participate online events.
            <br><br>
            <a class="button is-large is-primary">Sign Up or Log In</a>
          </p>
        </div>
      </div>
    </section> -->
    <section class="section">
      <div class="container">
        <h1 class="title">GTA Online Jobs</h1>
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
import {mapState} from 'vuex';

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

<style lang="scss" scoped>
.hero__welcome {
  font-family: 'Pavanam';
}
</style>

