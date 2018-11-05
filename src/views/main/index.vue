<template>
  <div>
    <section class="hero is-fullheight is-dark hero__welcome" style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6)), url('https://media.rockstargames.com/rockstargames-newsite/uploads/25d22aa4973a9a13d94c5df860eb6ecc1ba86021.jpg') 50% 50%;" v-if="false">
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
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">GTA Online Jobs</h1>
        <jobs-list/>
      </div>
    </section>

    <section
      v-if="count"
      class="hero"
    >
      <div class="hero-body">
        <div class="container">
          <custom-pagination
            :curr-page="actualPage"
            :total-items="count"
            :load-more-button="true"
            :per-page="perPage"
            :loading="loading"
            @load-more="loadMore"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

import JobsList from '@/components/job-list/JobList.vue';
import CustomPagination from '@/components/CustomPagination.vue';

const JOBS_PER_PAGE_DEFAULT = 30;

export default {
  fetchData({store, route}) {
    return store.dispatch('jobs/fetch', route.query);
  },

  components: {
    JobsList,
    CustomPagination,
  },

  data() {
    return {
      perPage: JOBS_PER_PAGE_DEFAULT,
      loading: false,
      actualPage: Number(this.$route.query.page) || 1
    };
  },

  computed: {
    ...mapState('jobs', [
      'count',
    ]),
  },

  watch: {
    $route(to) {
      this.actualPage = Number(to.query.page) || 1;
    },
  },

  methods: {
    async loadMore() {
      const newQuery = {
        ...this.$route.query,
        page: this.actualPage + 1,
      };

      this.loading = true;

      try {
        await this.$store.dispatch('jobs/fetch', {
          ...newQuery,
          append: true,
        });

        this.actualPage++;
      } catch (e) {}

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.hero__welcome {
  font-family: "Pavanam", sans-serif;
}
</style>

